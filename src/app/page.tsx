"use client";

import React, { useEffect, useRef, useState } from "react";
import IncidentPlayer from "@/components/IncidentPlayer";
import IncidentList from "@/components/IncidentList";
import IncidentTimeline, { Incident } from "@/components/IncidentTimeline";

import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
} from "react-icons/fi";

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/incidents?resolved=false")
      .then((r) => r.json())
      .then((data: Incident[]) => setIncidents(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.playbackRate = speed;
    playing ? vid.play() : vid.pause();
  }, [playing, speed]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onTime = () => setTime(vid.currentTime);
    vid.addEventListener("timeupdate", onTime);
    return () => vid.removeEventListener("timeupdate", onTime);
  }, []);

  const togglePlay = () => setPlaying((p) => !p);
  const skip = (s: number) => {
    const vid = videoRef.current;
    if (vid) vid.currentTime = Math.max(0, vid.currentTime + s);
  };
  const cycleSpeed = () => {
    const opts = [0.5, 1, 1.5, 2] as const;
    const idx = opts.indexOf(speed as any);
    setSpeed(opts[(idx + 1) % opts.length]);
  };
  const fmt = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      Math.floor(sec % 60)
    ).padStart(2, "0")}`;

  if (loading) return <div style={{ padding: 16, color: "#ccc" }}>Loading…</div>;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
   
      <div style={{ display: "flex", gap: 16, padding: 16, flex: "none" }}>
        <div style={{ flex: 2 }}>
          <IncidentPlayer videoRef={videoRef} />
        </div>
        <div style={{ flex: 1, maxHeight: 530, overflowY: "auto" }}>
          <IncidentList />
        </div>
      </div>


      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "6px 12px",      
          gap: 16,                    
          flex: "none",
          borderTop: "1px solid #333",
          borderBottom: "1px solid #333",
          background: "#1a1a1a",
          borderRadius: "0 0 8px 8px" 
        }}
      >
        <button onClick={() => skip(-10)} title="-10 s" style={{ background: "none", border: "none", cursor: "pointer" }}>
          <FiSkipBack size={20} color="#eee" />
        </button>
        <button onClick={togglePlay} title={playing ? "Pause" : "Play"} style={{ background: "none", border: "none", cursor: "pointer" }}>
          {playing ? <FiPause size={20} color="#eee" /> : <FiPlay size={20} color="#eee" />}
        </button>
        <button onClick={() => skip(10)} title="+10 s" style={{ background: "none", border: "none", cursor: "pointer" }}>
          <FiSkipForward size={20} color="#eee" />
        </button>
        <span style={{ color: "#eee", fontFamily: "monospace", fontSize: 14 }}>
          {fmt(time)}{" "}
          <em style={{ opacity: 0.7, fontStyle: "normal" }}>
            on{" "}
            {new Date().toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </em>
        </span>
        <button
          onClick={cycleSpeed}
          style={{
            background: "#333",
            border: "none",
            color: "#eee",
            padding: "2px 6px",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 14,
          }}
          title="Cycle playback speed"
        >
          {speed}×
        </button>
      </div>


      <div
        style={{
          padding: "8px 12px",   
          flex: 1,
          borderRadius: "0 0 8px 8px",
          overflow: "hidden",
        }}
      >
        <IncidentTimeline
          incidents={incidents}
          onScrub={(d) => {
            const secs = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
            if (videoRef.current) videoRef.current.currentTime = secs;
          }}
        />
      </div>
    </div>
  );
}
