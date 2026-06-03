"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type SectionKey = "top" | "games" | "about" | "find";

const navItems = [
  { id: "games" as SectionKey, label: "Games", href: "#games", icon: "/icons/games.png" },
  { id: "about" as SectionKey, label: "About", href: "#about", icon: "/icons/about.png" },
  { id: "find" as SectionKey, label: "Find Me", href: "#find", icon: "/icons/findme.png" },
];

const allSections = [
  { id: "top" as SectionKey, href: "#top" },
  ...navItems,
];

export function NavBar() {
  const [active, setActive] = useState<SectionKey>("top");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const marker = window.scrollY + 170;
      let current: SectionKey = "top";
      allSections.forEach((s) => {
        const el = document.querySelector<HTMLElement>(s.href);
        if (!el) return;
        if (marker >= el.offsetTop) current = s.id;
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
      setIsOpen(false);
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

  return (
    <>
      <button
        className={`sidenav-toggle${isOpen ? " is-open" : ""}`}
        type="button"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Image
          src="/icons/arrow.png"
          alt=""
          width={44}
          height={44}
          unoptimized
          style={{ objectFit: "contain" }}
        />
      </button>

      <nav className={`sidenav${isOpen ? " is-open" : ""}`} aria-label="Site navigation">
        {/* Home pinned at the top */}
        <div className="sidenav__home-wrap">
          <a
            href="#top"
            onClick={handleClick("#top", "top")}
            className="sidenav__btn sidenav__btn--home"
            aria-label="Home"
          >
            <Image
              src="/icons/home.png"
              alt=""
              width={76}
              height={76}
              unoptimized
              style={{ objectFit: "contain", opacity: 0.88 }}
            />
          </a>
          <span className="sidenav__tooltip" aria-hidden="true">Home</span>
        </div>

        {/* Nav items centered in remaining space */}
        <ul className="sidenav__list">
          {navItems.map((item) => (
            <li key={item.id} className="sidenav__item">
              <a
                href={item.href}
                onClick={handleClick(item.href, item.id)}
                className={`sidenav__btn${active === item.id ? " sidenav__btn--active" : ""}`}
                aria-label={item.label}
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={72}
                  height={72}
                  unoptimized
                  style={{ objectFit: "contain", opacity: active === item.id ? 1 : 0.88 }}
                />
              </a>
              <span className="sidenav__tooltip" aria-hidden="true">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
