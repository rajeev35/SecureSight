"use client";

import React, { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiPlusCircle,
  FiFilter,
  FiCheckCircle,
  FiCamera as FiCamIcon,
  FiClock,
  FiShieldOff,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";
import styles from "./IncidentList.module.css";

interface Incident {
  id: number;
  cameraId: number;
  type: string;
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
  camera: {
    id: number;
    name: string;
    location: string;
  };
}

const TYPE_MAP: Record<string, { icon: React.ReactNode; bg: string; fg: string }> = {
  "Unauthorised Access": {
    icon: <FiShieldOff />,
    bg: "#2F1B00",
    fg: "#E65C00",
  },
  "Gun Threat": {
    icon: <FiAlertCircle />,
    bg: "#2B0000",
    fg: "#C20000",
  },
  "Face Recognised": {
    icon: <FiUser />,
    bg: "#001A2F",
    fg: "#0066CC",
  },
  "Crowd Detected": {
    icon: <FiUser />,
    bg: "#00331F",
    fg: "#00875A",
  },
  "Traffic Congestion": {
    icon: <FiCamIcon />,
    bg: "#002E33",
    fg: "#00A3C4",
  },
};

export default function IncidentList() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/incidents?resolved=false")
      .then((r) => r.json())
      .then((unresolved: Incident[]) => {
        setIncidents(unresolved);
        return fetch("/api/incidents?resolved=true");
      })
      .then((r) => r.json())
      .then((resolved: Incident[]) => {
        setResolvedCount(resolved.length);
      })
      .finally(() => setLoading(false));
  }, []);

  const resolveIncident = async (id: number) => {
    setIncidents((prev) => prev.filter((i) => i.id !== id));
    setResolvedCount((c) => c + 1);
    await fetch(`/api/incidents/${id}/resolve`, { method: "PATCH" });
  };

  if (loading) return <div className={styles.message}>Loading…</div>;
  if (!incidents.length)
    return <div className={styles.message}>No unresolved incidents</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <FiAlertTriangle className={styles.titleIcon} />
          {incidents.length} Unresolved Incidents
        </h2>
        <div className={styles.controls}>
          <FiPlusCircle className={styles.controlIcon} />
          <FiFilter className={styles.controlIcon} />
          <span className={styles.resolvedBadge}>
            <FiCheckCircle className={styles.resolvedIcon} />
            {resolvedCount} resolved incidents
          </span>
        </div>
      </div>

      <ul className={styles.list}>
        {incidents.map((inc) => {
          const { icon, bg, fg } = TYPE_MAP[inc.type] || {
            icon: <FiAlertCircle />,
            bg: "#333",
            fg: "#888",
          };
         
          const filename = inc.thumbnailUrl.split("/").pop() || inc.thumbnailUrl;

          return (
            <li key={inc.id} className={styles.item}>
              <img
                src={`/thumbnails/${filename}`}
                alt={inc.type}
                className={styles.thumb}
              />
              <div className={styles.content}>
                <div className={styles.row}>
                  <span
                    className={styles.badge}
                    style={{ backgroundColor: bg, color: fg }}
                  >
                    {icon}
                    <span className={styles.badgeText}>{inc.type}</span>
                  </span>
                  <button
                    className={styles.resolve}
                    onClick={() => resolveIncident(inc.id)}
                  >
                    Resolve &gt;
                  </button>
                </div>
                <div className={styles.meta}>
                  <FiCamIcon className={styles.metaIcon} />
                  <span>{inc.camera.location}</span>
                </div>
                <div className={styles.meta}>
                  <FiClock className={styles.metaIcon} />
                  <span>
                    {new Date(inc.tsStart).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" – "}
                    {new Date(inc.tsEnd).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" on "}
                    {new Date(inc.tsStart).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
