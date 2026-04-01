"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type SectionKey = "top" | "games" | "about" | "find";

const sections: { id: SectionKey; label: string; href: string }[] = [
  { id: "top", label: "Home", href: "#top" },
  { id: "games", label: "Games", href: "#games" },
  { id: "about", label: "About", href: "#about" },
  { id: "find", label: "Find Me", href: "#find" },
];

export function NavBar() {
  const [active, setActive] = useState<SectionKey>("top");

  useEffect(() => {
    const handleScroll = () => {
      const marker = window.scrollY + 170;
      let current: SectionKey = "top";

      sections.forEach((section) => {
        const el = document.querySelector<HTMLElement>(section.href);
        if (!el) return;
        if (marker >= el.offsetTop) current = section.id;
      });

      setActive(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
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
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between rounded-2xl border border-[#fbd8ae]/25 bg-[#4f1d0e]/82 px-3 shadow-[0_20px_45px_rgba(12,3,1,0.4)] backdrop-blur-xl sm:px-5">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[#fbd8ae]/30 bg-[#6d2a12]/40">
            <Image
              src="/images/pfp.png"
              alt="Yanns Studios logo"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
          <span className="hidden text-sm font-semibold tracking-[0.06em] text-[#ffecd1] sm:block">
            Yanns Studios
          </span>
        </div>
        <nav className="flex items-center gap-1 rounded-full border border-[#fbd8ae]/20 bg-[#fbd8ae]/8 p-1">
          {sections.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={handleClick(item.href, item.id)}
              className={`inline-flex min-w-[4.8rem] items-center justify-center rounded-full px-3 py-2 text-xs font-semibold tracking-[0.035em] transition active:scale-95 ${
                active === item.id
                  ? "bg-[#fbba72] text-[#2a1008] shadow-[0_10px_24px_rgba(251,186,114,0.35)]"
                  : "text-[#ffead0]/78 hover:bg-[#fbd8ae]/20 hover:text-[#fff7eb]"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
