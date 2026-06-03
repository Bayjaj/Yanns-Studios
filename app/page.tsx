import Image from "next/image";
import path from "path";
import { promises as fs } from "fs";
import { NavBar } from "./components/NavBar";
import { RevealSection } from "./components/RevealSection";
import { CountUp } from "./components/CountUp";

async function getGalleryImages() {
  try {
    const galleryDir = path.join(process.cwd(), "public", "gallery");
    const files = await fs.readdir(galleryDir);
    const images = files
      .filter((file) => /\.(png|jpe?g|webp|gif|avif)$/i.test(file))
      .sort((a, b) => a.localeCompare(b));
    return images.map((file) => `/gallery/${file}`);
  } catch (error) {
    console.error("Error reading gallery directory:", error);
    return [];
  }
}

type RobloxGame = {
  placeId: number;
  title: string;
  cover: string;
  url: string;
  role: string;
  universeId?: number;
  playing?: number;
  visits?: number;
  description?: string;
};

function clampDescription(description?: string): string {
  const fallback = "Explore and have fun in this experience.";
  const raw = (description ?? fallback).trim();
  if (raw.length <= 250) return raw;
  return `${raw.slice(0, 250).trimEnd()}...`;
}

async function enrichGameStats(game: RobloxGame): Promise<RobloxGame> {
  try {
    const universeRes = await fetch(
      `https://apis.roblox.com/universes/v1/places/${game.placeId}/universe`,
      { cache: "no-store" },
    );
    if (!universeRes.ok) throw new Error("universe lookup failed");

    const universeData = await universeRes.json();
    const universeId = universeData.universeId;

    const gamesRes = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${universeId}`,
      { cache: "no-store" },
    );
    if (!gamesRes.ok) throw new Error("game stats lookup failed");

    const statsJson = await gamesRes.json();
    const details = statsJson.data?.[0];

    return {
      ...game,
      universeId,
      playing: details?.playing ?? game.playing,
      visits: details?.visits ?? game.visits,
      description: details?.description ?? game.description,
      title: details?.name ?? game.title,
    };
  } catch (error) {
    console.error(`Failed to fetch Roblox data for ${game.title}:`, error);
    return game;
  }
}

export default async function Home() {
  const galleryImages = await getGalleryImages();
  const fallbackImages = [
    "/gallery/regular2.png",
    "/gallery/paint.png",
    "/gallery/panda1.png",
    "/gallery/panda2.png",
    "/gallery/panda3.png",
    "/gallery/panda4.png",
  ];

  const imagesToShow = galleryImages.length ? galleryImages : fallbackImages;
  const baseGames: RobloxGame[] = [
    {
      placeId: 131452190170307,
      title: "BRAINROT TAG",
      cover: "/gameicons/brainrot.png",
      url: "https://www.roblox.com/games/131452190170307/BRAINROT-TAG",
      role: "50%",
      description: "Dodge the brainrot and stay alive in the arena.",
    },
    {
      placeId: 108060803651785,
      title: "Grow Bamboo For Pandas",
      cover: "/gameicons/bamboo.png",
      url: "https://www.roblox.com/games/108060803651785/Grow-Bamboo-For-Pandas",
      role: "Solo",
      description: "Grow bamboo and build up your panda sanctuary.",
    },
    {
      placeId: 107091004867390,
      title: "Race Pandas",
      cover: "/gameicons/race.png",
      url: "https://www.roblox.com/games/107091004867390/Race-Pandas",
      role: "50%",
      description: "Race your panda to the finish line!",
    },
    {
      placeId: 101928524081695,
      title: "Paint or Die",
      cover: "/gameicons/panit or die.png",
      url: "https://www.roblox.com/games/101928524081695/Paint-or-Die",
      role: "Solo",
      description: "Race for the right color or get caught - pick fast and survive.",
    },
    {
      placeId: 90080785169868,
      title: "Back To Rooms",
      cover: "/gameicons/rooms to back.png",
      url: "https://www.roblox.com/games/90080785169868/Back-To-Rooms",
      role: "35%",
      description: "Find your way back through the rooms.",
    },
  ];

  const games = await Promise.all(baseGames.map(enrichGameStats));
  const totalVisits = games.reduce((sum, game) => sum + (game.visits ?? 0), 0);
  const totalPlaying = games.reduce((sum, game) => sum + (game.playing ?? 0), 0);

  return (
    <div className="site-shell relative min-h-screen overflow-x-clip text-[#fff4e6]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-30"
        style={{
          background:
            "#bf5014",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            "none",
        }}
      />
      <NavBar />
      <div className="site-glow site-glow--left" aria-hidden="true" />
      <div className="site-glow site-glow--right" aria-hidden="true" />

      <section id="top" className="hero-section">
        <div className="hero-noise" aria-hidden="true" />

        <div className="hero-container">
          <div className="hero-content reveal">
            <p className="eyebrow">Yanns Studios</p>
            <h1 className="hero-title">
              Creating games for players to enjoy
            </h1>
            <p className="hero-subtitle">Founded May 1st, 2025</p>

            <div className="hero-stats">
              <div className="hero-stat">
                <p className="hero-stat__value">
                  <CountUp value={totalVisits} />
                </p>
                <p className="hero-stat__label">Total Visits</p>
              </div>
              <div className="hero-stat">
                <p className="hero-stat__value">
                  <CountUp value={totalPlaying} duration={1200} />
                </p>
                <p className="hero-stat__label">Active Players</p>
              </div>
              <div className="hero-stat">
                <p className="hero-stat__value">{games.length}</p>
                <p className="hero-stat__label">Games</p>
              </div>
            </div>
          </div>

          <div className="hero-arrow" aria-hidden="true">
            <div style={{ transform: "scaleY(-1)" }}>
              <Image
                src="/icons/arrow.png"
                alt=""
                width={80}
                height={80}
                unoptimized
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        {/* showcase-rail commented out temporarily
        <div className="showcase-rail" aria-hidden="true">
          <div className="marquee-wrap">
            {[0, 1].map((row) => (
              <div className="marquee" key={row}>
                <div
                  className={`marquee__inner ${row === 1 ? "marquee__inner--reverse" : ""}`}
                  style={{
                    ["--marquee-duration" as string]: row === 0 ? "34s" : "40s",
                  }}
                >
                  {[...imagesToShow, ...imagesToShow].map((src, idx) => (
                    <div className="marquee__item" key={`${src}-${row}-${idx}`}>
                      <div
                        className="marquee__card"
                        style={{
                          backgroundImage: `linear-gradient(145deg, rgba(0,0,0,0.28), rgba(0,0,0,0.14)), url("${src}")`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        */}
      </section>

      <div className="section-band">
      <RevealSection id="games" className="section-block section-games scroll-mt-28">
        <div className="section-head reveal">
          <p className="eyebrow">Collection</p>
          <h2>My Games</h2>
          <div className="section-head__line" />
        </div>

        <div className="stats-strip reveal reveal-delay-1">
          <div className="stat-card">
            <p className="stat-card__value">{totalVisits.toLocaleString()}</p>
            <p className="stat-card__label">Total Visits</p>
          </div>
          <div className="stat-card">
            <p className="stat-card__value">{totalPlaying.toLocaleString()}</p>
            <p className="stat-card__label">Active Players</p>
          </div>
          <div className="stat-card">
            <p className="stat-card__value">{games.length}</p>
            <p className="stat-card__label">Games</p>
          </div>
        </div>

        <div className="game-grid">
          {games.map((game, index) => (
            <a
              key={game.placeId}
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              className="game-card reveal"
              style={{ animationDelay: `${index * 110}ms` }}
            >
              <div className="game-card__media">
                <Image
                  src={game.cover}
                  alt={game.title}
                  fill
                  className="object-cover object-center transition duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  priority={index === 0}
                />
                <span className="game-card__role">{game.role}</span>
              </div>

              <div className="game-card__body">
                <h3 className="game-card__title">{game.title}</h3>

                <div className="game-card__stats">
                  <div className="game-card__stat-row">
                    <span className="game-card__stat-label">Playing</span>
                    <span className="game-card__stat-value game-card__stat-value--live">
                      {(game.playing ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="game-card__stat-row">
                    <span className="game-card__stat-label">Visits</span>
                    <span className="game-card__stat-value">
                      {(game.visits ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </RevealSection>
      </div>

      <div className="section-band">
      <RevealSection id="about" className="section-block section-about scroll-mt-28 pt-8">
        <div className="section-head reveal">
          <h2>About Me</h2>
          <div className="section-head__line" />
        </div>

        <div className="about-profile reveal reveal-delay-1">
          <div className="about-avatar">
            <Image
              src="/images/pfp.png"
              alt="Yanns Studios logo"
              fill
              className="object-cover"
              sizes="220px"
            />
          </div>

          <p className="about-copy">
            I began playing Roblox in 2011, and I&apos;ve loved the platform ever since. I&apos;m from the USA (GMT-5), and I go to University for Computer Science /
            Software Engineering, on path to get my masters. I love building socially
            interactive, party-style games. I&apos;m expanding my arsenal into
            new genres soon. I&apos;m open to collaborating with simillarly experienced
            developers on future projects, so reach out on discord if you&apos;re interested!
          </p>
        </div>

        <div className="about-skills reveal reveal-delay-2">
          <h3 className="about-skills__title">
            Skills
          </h3>
          <div className="about-skills__grid">
            <div className="skill-panel skill-panel--primary">
              <p className="skill-panel__label">Primary</p>
              <div className="skill-tags skill-tags--primary">
                {["Scripting", "Project Management", "Game Design"].map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="skill-panel">
              <p className="skill-panel__label">Tools</p>
              <div className="skill-tags">
                {["Rojo", "Git", "Figma", "Wally", "Photopea"].map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </RevealSection>
      </div>

      <RevealSection id="find" className="section-block section-find scroll-mt-28">
        <div className="section-head reveal">
          <p className="eyebrow">Connect With Me</p>
          <h2>My Links</h2>
          <div className="section-head__line" />
        </div>

        <div className="links-strip reveal reveal-delay-1" aria-label="Profile links">
          <a
            href="https://www.roblox.com/users/20896161/profile"
            target="_blank"
            rel="noopener noreferrer"
            className="links-strip__item"
          >
            <Image
              src="/images/roblox icon.png"
              alt=""
              width={24}
              height={24}
              className="links-strip__icon"
            />
            <span className="links-strip__name">epictepigss</span>
          </a>

          <a
            href="https://discordapp.com/users/337273125332844544"
            target="_blank"
            rel="noopener noreferrer"
            className="links-strip__item"
          >
            <Image
              src="/images/discord.jpg"
              alt=""
              width={24}
              height={24}
              className="links-strip__icon"
            />
            <span className="links-strip__name">yann4</span>
          </a>

          <a
            href="https://www.youtube.com/@Yann4dev"
            target="_blank"
            rel="noopener noreferrer"
            className="links-strip__item"
          >
            <Image
              src="/images/youtube.svg"
              alt=""
              width={24}
              height={24}
              className="links-strip__icon"
            />
            <span className="links-strip__name">@Yann4dev</span>
          </a>
        </div>

        <div className="mx-auto mt-4 w-full max-w-4xl text-center text-sm font-semibold text-[#fff4e6]/80">
          *for business inquiries, add and dm me on discord
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 text-xs text-[#ffe8cc]/70 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[#fbd8ae]/30 bg-[#5b220f]/70">
              <Image
                src="/images/pfp.png"
                alt="Yanns Studios logo"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="font-semibold text-[#ffe8cb]/90">Yanns Studios</span>
          </div>
          <span>
            &copy; {new Date().getFullYear()} Yanns Studios. All rights
            reserved.
          </span>
        </div>
      </RevealSection>
    </div>
  );
}
