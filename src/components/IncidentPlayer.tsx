"use client";

import React, { RefObject, useState } from "react";
import styles from "./IncidentPlayer.module.css";

interface IncidentPlayerProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}

export default function IncidentPlayer({ videoRef }: IncidentPlayerProps) {
  const thumbnails = [
    { label: "Camera – 01", src: "/video-stub.mp4" },
    { label: "Camera – 02", src: "/video-stub.mp4" },
    { label: "Camera – 03", src: "/video-stub.mp4" },
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = thumbnails[selectedIndex];

  return (
    <div className={styles.playerContainer}>

      <div className={styles.mainFrame}>
        <video
          ref={videoRef}                   
          src={selected.src}
          className={styles.videoStub}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.activeLabel}>
            <span className={styles.recordDot} />
          {selected.label}
        </div>
      </div>


      <div className={styles.thumbStrip}>
        {thumbnails.map((t, i) => (
          i === selectedIndex ? null :   
          <div
            key={i}
            className={styles.thumbWrapper}
            onClick={() => setSelectedIndex(i)}
          >
            <video
              src={t.src}
              className={styles.thumb}
              muted
              playsInline
            />
            <div className={styles.thumbLabel}>{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
