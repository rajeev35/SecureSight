"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  FiShieldOff,
  FiAlertCircle,
  FiUser,
  FiCamera as FiCamIcon,
} from "react-icons/fi";
import styles from "./IncidentTimeline.module.css";

export type Incident = {
  id: number;
  cameraId: number;
  type: string;
  tsStart: string;
  tsEnd: string;
};

interface TimelineProps {
  incidents: Incident[];
  onScrub: (date: Date) => void;
}

const TYPE_MAP: Record<string, { icon: JSX.Element; fg: string }> = {
  "Unauthorised Access": { icon: <FiShieldOff />, fg: "#E65C00" },
  "Gun Threat":          { icon: <FiAlertCircle />, fg: "#C20000" },
  "Face Recognised":     { icon: <FiUser />,        fg: "#0066CC" },
  "Traffic Congestion":  { icon: <FiCamIcon />,     fg: "#00A3C4" },
};

export default function IncidentTimeline({ incidents, onScrub }: TimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scrubberPos, setScrubberPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const cameras = Array.from(new Set(incidents.map(i => i.cameraId))).sort();
  const rowHeight = 40;
  const headerWidth = 120;
  const padding = 40;
  const height = cameras.length * rowHeight + padding * 2;

  const dateToX = (date: Date, totalWidth: number) => {
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const ratio = (date.getTime() - start.getTime()) / (24 * 3600 * 1000);
    return headerWidth + padding + ratio * (totalWidth - headerWidth - padding * 2);
  };

  const tracksPerRow = cameras.map(camId =>
    incidents.filter(i => i.cameraId === camId)
  );

  const startDrag = (e: React.MouseEvent) => {
    setIsDragging(true);
    moveScrub(e.clientX);
  };
  const onMove = (e: MouseEvent) => {
    if (isDragging) moveScrub(e.clientX);
  };
  const endDrag = () => setIsDragging(false);

  const moveScrub = (clientX: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const totalWidth = rect.width;
    let x = clientX - rect.left;
    const tickW = (totalWidth - headerWidth - padding * 2) / 24;
    x = Math.max(headerWidth + padding + tickW, Math.min(totalWidth - padding - tickW, x));
   
    setScrubberPos(x);

    const ratio = (x - headerWidth - padding) / (totalWidth - headerWidth - padding * 2);
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setMilliseconds(ratio * 24 * 3600 * 1000);
    onScrub(d);
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", endDrag);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", endDrag);
    };
  }, [isDragging]);

  return (
    <div className={styles.container}>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 1000 ${height}`}
        preserveAspectRatio="none"
        onMouseDown={startDrag}
        className={styles.svg}
      >
        {cameras.map((camId, idx) => {
          const y = padding + idx * rowHeight + rowHeight / 2 + 4;
          return (
            <g key={camId}>
              <FiCamIcon x={16} y={y - 8} color="#ccc" fontSize={16} />
              <text x={40} y={y} fill="#ccc" fontSize={12}>
                Camera – {String(camId).padStart(2, "0")}
              </text>
            </g>
          );
        })}

        {[...Array(25)].map((_, h) => {
          const x = headerWidth + padding + (h / 24) * (1000 - headerWidth - padding * 2);
          return (
            <g key={h}>
              <line
                x1={x}
                y1={padding - 8}
                x2={x}
                y2={height - padding + 8}
                stroke="#444"
                strokeWidth={1}
              />
              <text
                x={x}
                y={padding - 14}
                fill="#888"
                fontSize={10}
                textAnchor="middle"
              >
                {h}
              </text>
            </g>
          );
        })}

        {tracksPerRow.flatMap((rowIncidents, rowIdx) =>
          rowIncidents.map((evt) => {
            const totalW = 1000;
            const x1 = dateToX(new Date(evt.tsStart), totalW);
            const x2 = dateToX(new Date(evt.tsEnd), totalW);
            const barY = padding + rowIdx * rowHeight + 4;
            const barH = rowHeight - 8;
            const { icon, fg } = TYPE_MAP[evt.type] || {
              icon: <FiAlertCircle />,
              fg: "#888",
            };

            return (
              <g key={evt.id}>
                <rect
                  x={x1}
                  y={barY}
                  width={x2 - x1}
                  height={barH}
                  rx={4}
                  fill={`${fg}33`}
                />
                <text
                  x={x1 + 6}
                  y={barY + barH / 2 + 2}
                  fill={fg}
                  fontSize={10}
                  fontWeight="500"
                >
                  {icon}
                  <tspan dx="4">
                    {evt.type.length > 12
                      ? evt.type.match(/.{1,12}/g)?.join("\n")
                      : evt.type}
                  </tspan>
                </text>
              </g>
            );
          })
        )}

        <line
          x1={scrubberPos}
          y1={padding - 8}
          x2={scrubberPos}
          y2={height - padding + 8}
          stroke="#E6D500"
          strokeWidth={2}
        />
        <circle
          cx={scrubberPos}
          cy={padding - 8}
          r={6}
          fill="#E6D500"
          stroke="#000"
          strokeWidth={1}
          cursor="ew-resize"
        />
      </svg>
    </div>
  );
}
