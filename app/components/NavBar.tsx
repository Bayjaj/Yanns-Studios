"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type SectionKey = "top" | "games" | "find";

const sections: { id: SectionKey; label: string; href: string }[] = [
  { id: "top", label: "Home", href: "#top" },
  { id: "games", label: "Games", href: "#games" },
  { id: "find", label: "Find Me", href: "#find" },
];

export function NavBar() {
  const [active, setActive] = useState<SectionKey>("top");

  useEffect(() => {
    const handleScroll = () => {
      let current: SectionKey = "top";
      sections.forEach((section) => {
        const el = document.querySelector<HTMLElement>(section.href);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const viewLine = 160; // line below the sticky nav
        if (rect.top <= viewLine && rect.bottom >= viewLine) {
          current = section.id;
        }
      });
      setActive(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick =
    (href: string, id: SectionKey) =>
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setActive(id);
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#0b1020]/95 backdrop-blur-lg">
      <div className="flex h-16 w-full items-center justify-between px-6 sm:h-18 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/15 bg-[#0f172a]">
            <Image
              src="/images/pfp.png"
              alt="Yanns Studios logo"
              fill
              className="object-cover"
              sizes="44px"
              priority
            />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Yanns Studios
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {sections.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={handleClick(item.href, item.id)}
              className={`transition-colors ${active === item.id ? "text-[#2d6cf7]" : "text-white/80 hover:text-white"}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
