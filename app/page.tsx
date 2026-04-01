import Image from "next/image";
import path from "path";
import { promises as fs } from "fs";
import { NavBar } from "./components/NavBar";
import { RevealSection } from "./components/RevealSection";

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
  const heroPanelImages = [
    "/gallery/att.pr3oTJ2VMwSYr-GS2yvwroWx0fod563u6RexeHFAW64.png.jpg",
    "/gallery/icevix double chase.png",
    "/gallery/icevix meowl selfie.png",
    "/gallery/panda1.png",
  ];

  const baseGames: RobloxGame[] = [
    {
      placeId: 131452190170307,
      title: "BRAINROT TAG",
      cover: "/gallery/regular2.png",
      url: "https://www.roblox.com/games/131452190170307/BRAINROT-TAG",
      description: "Dodge the brainrot and stay alive in the arena.",
    },
    {
      placeId: 108060803651785,
      title: "Grow Bamboo For Pandas",
      cover: "/gallery/panda1.png",
      url: "https://www.roblox.com/games/108060803651785/Grow-Bamboo-For-Pandas",
      description: "Grow bamboo and build up your panda sanctuary.",
    },
    {
      placeId: 101928524081695,
      title: "Paint or Die",
      cover: "/gallery/paint.png",
      url: "https://www.roblox.com/games/101928524081695/Paint-or-Die",
      description: "Race for the right color or get caught - pick fast and survive.",
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
            "linear-gradient(105deg, #fbba72 0%, #ca5310 30%, #bb4d00 51%, #8f250c 74%, #691e06 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            "radial-gradient(1200px 650px at -10% -10%, rgba(255, 232, 196, 0.16), transparent 66%), radial-gradient(980px 550px at 112% -14%, rgba(255, 186, 107, 0.22), transparent 68%), linear-gradient(180deg, rgba(22, 7, 4, 0.28), rgba(11, 3, 2, 0.6))",
        }}
      />
      <NavBar />
      <div className="site-glow site-glow--left" aria-hidden="true" />
      <div className="site-glow site-glow--right" aria-hidden="true" />

      <section id="top" className="hero-section">
        <div className="hero-noise" aria-hidden="true" />

        <div className="hero-container">
          <div className="hero-copy reveal">
            <p className="eyebrow">Yanns Studios</p>
            <h1
              className="hero-title"
              data-text="Creating games for players to enjoy"
            >
              Creating games for players to enjoy
            </h1>
            <p className="hero-subtitle">Founded May 1st, 2025</p>

            <div className="hero-actions">
              <a href="#games" className="btn btn-primary">
                My Games
              </a>
              <a href="#find" className="btn btn-secondary">
                Find Me
              </a>
            </div>
          </div>

          <aside className="hero-panel reveal reveal-delay-1">
            <div className="hero-panel__header">
              <p className="hero-panel__title">Studio Snapshot</p>
              <span className="hero-panel__dot" />
            </div>

            <div className="hero-panel__stats">
              <div>
                <p className="hero-panel__value">{totalVisits.toLocaleString()}</p>
                <p className="hero-panel__label">Total Visits</p>
              </div>
              <div>
                <p className="hero-panel__value">{totalPlaying.toLocaleString()}</p>
                <p className="hero-panel__label">Active Players</p>
              </div>
            </div>

            <div className="hero-collage">
              {heroPanelImages.map((src, idx) => (
                <div
                  key={`${src}-${idx}`}
                  className="hero-collage__tile"
                  style={{
                    backgroundImage: `linear-gradient(150deg, rgba(0,0,0,0.34), rgba(0,0,0,0.08)), url("${src}")`,
                  }}
                />
              ))}
            </div>
          </aside>
        </div>

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
      </section>

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
        </div>

        <div className="game-grid">
          {games.map((game, index) => (
            <article
              key={game.placeId}
              className="game-card reveal"
              style={{ animationDelay: `${index * 110}ms` }}
            >
              <div className="game-card__media">
                <Image
                  src={game.cover}
                  alt={game.title}
                  fill
                  className="object-cover object-center transition duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                />
              </div>

              <div className="game-card__body">
                <h3 className="game-card__title">{game.title}</h3>

                <div className="game-card__metrics">
                  <span className="metric-pill">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    {(game.playing ?? 0).toLocaleString()}
                  </span>
                  <span className="metric-pill">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                    </svg>
                    {(game.visits ?? 0).toLocaleString()}
                  </span>
                </div>

                <p className="game-card__desc">
                  {clampDescription(game.description)}
                </p>

                <a
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-card"
                >
                  <Image
                    src="/images/roblox icon.png"
                    alt="Roblox icon"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                  View on Roblox
                </a>
              </div>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection id="about" className="section-block section-about scroll-mt-28 pt-8">
        <div className="section-head reveal">
          <h2>About Me</h2>
          <div className="section-head__line" />
        </div>

        <div className="mx-auto mt-10 grid w-full max-w-5xl items-stretch gap-5 md:grid-cols-[280px_minmax(0,1fr)]">
          <div className="reveal reveal-delay-1 rounded-2xl border border-[#fbd8ae]/30 bg-[#4b1d0f]/84 p-5 shadow-[0_20px_42px_rgba(13,3,1,0.4)]">
            <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl border border-[#fbd8ae]/35 bg-[#5b220f]/70">
              <Image
                src="/images/pfp.png"
                alt="Yanns Studios logo"
                fill
                className="object-cover"
                sizes="220px"
              />
            </div>
          </div>

          <article className="reveal reveal-delay-2 rounded-2xl border border-[#fbd8ae]/30 bg-[#4b1d0f]/84 p-5 shadow-[0_20px_42px_rgba(13,3,1,0.4)]">
            <p className="text-sm leading-8 text-[#ffe8cc]/84">
              I began playing roblox in 2011. I started developing games in
              June of 2025. I&apos;m from the USA, and I go to University for CS /
              SWE, on path to get my masters. I love building socially
              interactive, party-style games. I&apos;m expanding my arsenal into
              new genres soon. I&apos;m open to collaborating with experienced
              developers on future projects, so reach out if you&apos;re
              interested!
            </p>
          </article>
        </div>

        <div className="mx-auto mt-8 w-full max-w-5xl">
          <h3 className="text-center text-2xl font-semibold text-[#fff6ea]">
            Skills
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#fbd8ae]/30 bg-[#4b1d0f]/84 p-5 shadow-[0_16px_34px_rgba(13,3,1,0.35)]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffd9af]">
                Primary
              </p>
              <div className="mt-3 grid w-full gap-2 sm:grid-cols-3">
                <span className="flex min-h-[2.45rem] items-center justify-center rounded-lg border border-[#fbd8ae]/25 bg-[#5a2412]/70 px-3 py-2 text-center text-sm leading-tight font-semibold text-[#fff8ee]">
                  Scripter
                </span>
                <span className="flex min-h-[2.45rem] items-center justify-center rounded-lg border border-[#fbd8ae]/25 bg-[#5a2412]/70 px-3 py-2 text-center text-sm leading-tight font-semibold text-[#fff8ee]">
                  Project Manager
                </span>
                <span className="flex min-h-[2.45rem] items-center justify-center rounded-lg border border-[#fbd8ae]/25 bg-[#5a2412]/70 px-3 py-2 text-center text-sm leading-tight font-semibold text-[#fff8ee]">
                  Game Design
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#fbd8ae]/30 bg-[#4b1d0f]/84 p-5 shadow-[0_16px_34px_rgba(13,3,1,0.35)]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffd9af]">
                Secondary
              </p>
              <div className="mt-3 grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                <span className="flex min-h-[2.45rem] items-center justify-center rounded-lg border border-[#fbd8ae]/25 bg-[#5a2412]/70 px-3 py-2 text-center text-sm leading-tight font-semibold text-[#fff8ee]">
                  Building
                </span>
                <span className="flex min-h-[2.45rem] items-center justify-center rounded-lg border border-[#fbd8ae]/25 bg-[#5a2412]/70 px-3 py-2 text-center text-sm leading-tight font-semibold text-[#fff8ee]">
                  UI
                </span>
                <span className="flex min-h-[2.45rem] items-center justify-center rounded-lg border border-[#fbd8ae]/25 bg-[#5a2412]/70 px-3 py-2 text-center text-sm leading-tight font-semibold text-[#fff8ee]">
                  SFX
                </span>
                <span className="flex min-h-[2.45rem] items-center justify-center rounded-lg border border-[#fbd8ae]/25 bg-[#5a2412]/70 px-3 py-2 text-center text-sm leading-tight font-semibold text-[#fff8ee]">
                  VFX
                </span>
                <span className="flex min-h-[2.45rem] items-center justify-center rounded-lg border border-[#fbd8ae]/25 bg-[#5a2412]/70 px-3 py-2 text-center text-sm leading-tight font-semibold text-[#fff8ee]">
                  Animation
                </span>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="find" className="section-block section-find scroll-mt-28">
        <div className="section-head reveal">
          <p className="eyebrow">Connect With Me</p>
          <h2>My Links</h2>
          <div className="section-head__line" />
        </div>

        <div className="mx-auto mt-10 grid w-full max-w-4xl gap-4">
          <a
            href="https://www.roblox.com/users/20896161/profile"
            target="_blank"
            rel="noopener noreferrer"
            className="group reveal reveal-delay-1 flex items-center justify-between rounded-2xl border border-[#fbd8ae]/30 bg-[#52200f]/80 px-5 py-4 shadow-[0_18px_34px_rgba(13,3,1,0.35)] transition hover:-translate-y-0.5 hover:border-[#fbd8ae]/45 hover:bg-[#5f2612]/85"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#fbd8ae]/30 bg-gradient-to-br from-[#fbba72]/30 to-[#ca5310]/20">
                <Image
                  src="/images/roblox icon.png"
                  alt="Roblox icon"
                  width={22}
                  height={22}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-[#fff8ef]">Roblox</p>
                <p className="text-sm text-[#ffe3c0]/78">epictepigss</p>
              </div>
            </div>
            <span className="text-lg font-bold text-[#ffe3c0]/72 transition group-hover:translate-x-1 group-hover:text-[#fff8ef]">
              -&gt;
            </span>
          </a>

          <a
            href="https://discordapp.com/users/337273125332844544"
            target="_blank"
            rel="noopener noreferrer"
            className="group reveal reveal-delay-2 flex items-center justify-between rounded-2xl border border-[#fbd8ae]/30 bg-[#52200f]/80 px-5 py-4 shadow-[0_18px_34px_rgba(13,3,1,0.35)] transition hover:-translate-y-0.5 hover:border-[#fbd8ae]/45 hover:bg-[#5f2612]/85"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#fbd8ae]/30 bg-gradient-to-br from-[#fbba72]/30 to-[#ca5310]/20">
                <Image
                  src="/images/discord.jpg"
                  alt="Discord icon"
                  width={22}
                  height={22}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-[#fff8ef]">Discord</p>
                <p className="text-sm text-[#ffe3c0]/78">yann4</p>
              </div>
            </div>
            <span className="text-lg font-bold text-[#ffe3c0]/72 transition group-hover:translate-x-1 group-hover:text-[#fff8ef]">
              -&gt;
            </span>
          </a>
        </div>

        <div className="mx-auto mt-4 w-full max-w-4xl text-center text-sm font-semibold text-[#ca5310]">
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
