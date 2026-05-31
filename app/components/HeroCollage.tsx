"use client";

import { useEffect, useState } from "react";

type HeroCollageProps = {
  images: string[];
};

export function HeroCollage({ images }: HeroCollageProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (!activeImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveImage(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeImage]);

  return (
    <div className="hero-collage">
      {images.map((src, idx) => (
        <button
          key={`${src}-${idx}`}
          type="button"
          className="hero-collage__tile-btn"
          aria-label={`Preview studio image ${idx + 1}`}
          onClick={() => setActiveImage(src)}
        >
          <span
            className="hero-collage__tile"
            style={{
              backgroundImage: `linear-gradient(150deg, rgba(0,0,0,0.34), rgba(0,0,0,0.08)), url("${src}")`,
            }}
          />
        </button>
      ))}

      {activeImage ? (
        <div
          className="hero-collage__modal"
          role="dialog"
          aria-modal="true"
          aria-label="Studio image preview"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="hero-collage__modal-backdrop"
          />
          <div
            className="hero-collage__modal-image"
            style={{
              backgroundImage: `linear-gradient(160deg, rgba(0,0,0,0.22), rgba(0,0,0,0.08)), url("${activeImage}")`,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
