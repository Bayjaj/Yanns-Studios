"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealSectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
};

export function RevealSection({
  id,
  className,
  children,
  threshold = 0.16,
  rootMargin = "0px 0px -14% 0px",
}: RevealSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <section
      ref={ref}
      id={id}
      className={`${className ?? ""} reveal-group ${visible ? "is-visible" : ""}`.trim()}
    >
      {children}
    </section>
  );
}
