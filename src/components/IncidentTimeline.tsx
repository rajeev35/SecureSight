"use client";
import React, { useRef, useState, useEffect, useMemo, ReactNode } from "react";
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
  currentTime: Date; 
}

const TYPE_MAP: Record<string, { icon: ReactNode; fg: string }> = {
  "Unauthorised Access": { icon: <FiShieldOff />, fg: "#E65C00" },
  "Gun Threat":          { icon: <FiAlertCircle />, fg: "#C20000" },
  "Face Recognised":     { icon: <FiUser />,        fg: "#0066CC" },
  "Traffic Congestion":  { icon: <FiCamIcon />,     fg: "#00A3C4" },
};


export default function IncidentTimeline({
  incidents,
  onScrub,
  currentTime,
}: TimelineProps) {
    
  const svgRef = useRef<SVGSVGElement>(null);
  const [scrubberPos, setScrubberPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  const [timelineStart, timelineEnd] = useMemo(() => {
    if (incidents.length === 0) {
      const now = new Date();
      return [now, new Date(now.getTime() + 1000)]; 
    }
    const allMs = incidents.flatMap(i => [
      new Date(i.tsStart).getTime(),
      new Date(i.tsEnd).getTime(),
    ]);
    const minMs = Math.min(...allMs);
    const maxMs = Math.max(...allMs);
    return [new Date(minMs), new Date(maxMs)];
  }, [incidents]);

  const cameras = Array.from(new Set(incidents.map(i => i.cameraId))).sort();
  const rowHeight = 40;
  const headerWidth = 120;  
  const padding = 16;
  const height = cameras.length * rowHeight + padding * 2 + 30; 
  


  const dateToX = (date: Date, totalWidth: number) => {
    const startMs = timelineStart.getTime();
    const spanMs  = timelineEnd.getTime() - startMs;
    const elapsed = date.getTime()   - startMs;
    const ratio   = spanMs > 0 ? elapsed / spanMs : 0;
    return (
      headerWidth +
      padding +
      ratio * (totalWidth - headerWidth - padding * 2)
    );
  };


  const tracksPerRow = cameras.map(camId =>
    incidents.filter(i => i.cameraId === camId)
  );


  const startDrag = (e: React.MouseEvent) => {
    setIsDragging(true);
    moveScrub(e.clientX);
  };
  const onMove = (e: MouseEvent) => isDragging && moveScrub(e.clientX);
  const endDrag = () => setIsDragging(false);

  const moveScrub = (clientX: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const totalW = rect.width;
    let x = clientX - rect.left;

    x = Math.max(headerWidth + padding, Math.min(totalW - padding, x));
    setScrubberPos(x);

    const ratio = (x - headerWidth - padding) / (totalW - headerWidth - padding*2);
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setMilliseconds(ratio * 24*3600*1000);
    onScrub(d);
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   endDrag);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   endDrag);
    };
  }, [isDragging]);
    useEffect(() => {
    const x = dateToX(currentTime, 1000);
    setScrubberPos(x);
  }, [currentTime, timelineStart, timelineEnd]);


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

        <text
          x={padding}
          y={padding + 12}
          fill="#fff"
          fontSize={16}
          fontWeight="500"
        >
          Camera List
        </text>


        {[...Array(50)].map((_, h) => {
          const x = headerWidth + padding + (h/24)*(1000 - headerWidth - padding*2);
          const label = `${String(h).padStart(2,"0")}:00`;
          return (
            <g key={h}>
              
              <text
                x={x}
                y={padding + 14}
                fill="#aaa"
                fontSize={6}
                textAnchor="middle"
                style={{ userSelect: "none" }}
              >
                {label}
              </text>
            </g>
          );
        })}

        
        {cameras.map((camId, idx) => {
        const y     = padding + 24 + idx * rowHeight + rowHeight / 2 + 4;
        const isSel = camId === selectedCamera;

        return (
            <g
            key={camId}
            onClick={() => setSelectedCamera(camId)}
            cursor="pointer"
            >
            
            {isSel && (
                <rect
                x={headerWidth}
                y={padding + 24 + idx * rowHeight}
                width={1000 - headerWidth}
                height={rowHeight}
                fill="#ffffff22"
                rx={4}
                />
            )}

            
            <FiCamIcon
                x={padding}
                y={y - 8}
                color={isSel ? "#fff" : "#ccc"}
                fontSize={16}
            />

         
            <text
                x={padding + 24}
                y={y}
                fill={isSel ? "#fff" : "#ccc"}
                fontSize={12}
            >
                Camera – {String(camId).padStart(2, "0")}
            </text>
            </g>
        );
        })}


      
        {tracksPerRow.flatMap((rowInc, rowIdx) =>
          rowInc.map(evt => {
            const totalW = 1000;
            const x1 = dateToX(new Date(evt.tsStart), totalW);
            const x2 = dateToX(new Date(evt.tsEnd),   totalW);
            const y  = padding + 24 + rowIdx*rowHeight + 4;
            const h  = rowHeight - 8;
            const { icon, fg } = TYPE_MAP[evt.type] || {
              icon: <FiAlertCircle />,
              fg: "#888",
            };
            return (
              <g key={evt.id}>
                <rect x={x1} y={y} width={x2-x1} height={h} rx={4} fill={`${fg}33`} />
                <text x={x1+6} y={y + h/2 + 2} fill={fg} fontSize={10} fontWeight="500">
                  {icon}
                  <tspan dx="4">
                    {evt.type.length>12
                      ? evt.type.match(/.{1,12}/g)?.join("\n")
                      : evt.type
                    }
                  </tspan>
                </text>
              </g>
            );
          })
        )}

      
        <line
          x1={scrubberPos}
          y1={padding+20}
          x2={scrubberPos}
          y2={height - padding}
          stroke="#E6D500" strokeWidth={2}
        />
        <circle
          cx={scrubberPos}
          cy={padding+20}
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
