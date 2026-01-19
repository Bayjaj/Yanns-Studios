import Image from "next/image";
import path from "path";
import { promises as fs } from "fs";
import { NavBar } from "./components/NavBar";

async function getGalleryImages() {
  try {
    const galleryDir = path.join(process.cwd(), "public", "gallery");
    const files = await fs.readdir(galleryDir);
    const images = files.filter((file) =>
      /\.(png|jpe?g|webp|gif|avif)$/i.test(file),
    );
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
    "/gallery/chase-orca.jpg",
    "/gallery/chase-red.jpg",
    "/gallery/chase-tree.jpg",
    "/gallery/chase-f-letter.jpg",
    "/gallery/chase-cat-toilet.jpg",
    "/gallery/chase-gold.jpg",
  ];
  const imagesToShow = galleryImages.length ? galleryImages : fallbackImages;

  const baseGames: RobloxGame[] = [
    {
      placeId: 131452190170307,
      title: "BRAINROT TAG",
      cover: "/gallery/regular2.png",
      url: "https://www.roblox.com/games/131452190170307/BRAINROT-TAG",
      description: "Dodge the brainrot and stay alive in the arena.",
    },
    {
      placeId: 101928524081695,
      title: "Paint or Die",
      cover: "/gallery/paint.png",
      url: "https://www.roblox.com/games/101928524081695/Paint-or-Die",
      description: "Race for the right color or get caught—pick fast and survive.",
    },
  ];

  const games = await Promise.all(baseGames.map(enrichGameStats));
  const totalVisits = games.reduce((sum, g) => sum + (g.visits ?? 0), 0);
  const totalPlaying = games.reduce((sum, g) => sum + (g.playing ?? 0), 0);

  return (
    <div
      id="top"
      className="relative min-h-screen overflow-hidden bg-[#05060d] text-white"
    >
      <NavBar />
      <div className="relative z-10 flex min-h-screen flex-col">

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#090d1a] to-[#060814]" />
          <div className="absolute inset-0 hero-noise" aria-hidden="true" />

          <div className="absolute left-0 right-0 top-0 h-[95vh] md:h-[100vh] overflow-hidden">
            <div className="marquee-wrap pb-12">
              {[0, 1].map((row) => (
                <div
                  className={`marquee ${row === 1 ? "marquee--reverse" : ""}`}
                  key={row}
                >
                  <div
                    className={`marquee__inner ${
                      row === 1 ? "marquee__inner--reverse" : ""
                    }`}
                    style={{
                      ["--marquee-duration" as string]:
                        row === 0 ? "34s" : "40s",
                    }}
                  >
                    {[...imagesToShow, ...imagesToShow].map((src, idx) => (
                      <div
                        className="marquee__item"
                        key={`${src}-${row}-${idx}`}
                      >
                        <div
                          className="marquee__card"
                          style={{
                            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.28), rgba(0,0,0,0.12)), url(${src})`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-[#05060d]" />
          </div>

          <main className="relative z-10 flex min-h-[100vh] items-center justify-center px-6 pb-28 pt-32 sm:px-10 lg:pt-32">
            <div className="w-full max-w-5xl text-center">
              <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight drop-shadow-[0_15px_45px_rgba(0,0,0,0.6)] sm:text-5xl lg:text-6xl">
                Creating games that players enjoy.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
                Providing polished, engaging, and enjoyable gameplay.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
                <a
                  href="#games"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#2d6cf7] px-8 text-sm font-semibold shadow-[0_12px_40px_rgba(45,108,247,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_45px_rgba(45,108,247,0.55)]"
                >
                  Our Games
                </a>
                <a
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-[#0b1020] shadow-[0_10px_35px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,255,255,0.16)]"
                >
                  Contact / Find Me
                </a>
              </div>
            </div>
          </main>
        </section>

        <section
          id="games"
          className="relative z-20 flex flex-col items-center bg-gradient-to-b from-[#05060d] via-[#080b18] to-[#05060d] px-6 pb-20 pt-10 sm:px-10 md:pb-28 md:pt-16 scroll-mt-24"
        >
          <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-center shadow-[0_12px_35px_rgba(0,0,0,0.45)] backdrop-blur">
              <p className="text-2xl font-bold text-[#4ea3ff]">
                {totalVisits.toLocaleString()}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Total Visits
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-center shadow-[0_12px_35px_rgba(0,0,0,0.45)] backdrop-blur">
              <p className="text-2xl font-bold text-[#4ea3ff]">
                {totalPlaying.toLocaleString()}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Active Players
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              My Games
            </h2>
            <div className="mt-2 h-0.5 w-16 rounded-full bg-[#2d6cf7] mx-auto" />
          </div>

          <div className="mt-12 grid w-full max-w-6xl gap-8 lg:grid-cols-2">
            {games.map((game) => (
              <div
                key={game.placeId}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c101d]/80 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-white/20"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={game.cover}
                    alt={game.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className="flex flex-col gap-4 px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {game.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-white/80">
                        <span className="flex items-center gap-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-4 w-4"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                          {(game.playing ?? 0).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-4 w-4"
                          >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                          </svg>
                          {(game.visits ?? 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="line-clamp-3 text-sm text-white/70">
                    {game.description ?? "Explore and have fun in this experience."}
                  </p>
                  <div className="flex">
                    <a
                      href={game.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#1c2336] px-4 text-sm font-semibold text-[#4ea3ff] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:bg-[#2d6cf7] hover:text-white hover:shadow-[0_14px_40px_rgba(45,108,247,0.45)]"
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
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="find"
          className="relative z-20 bg-gradient-to-b from-[#05060d] via-[#05060d] to-[#04060f] px-6 pb-16 pt-14 sm:px-10 md:pb-20 md:pt-18 scroll-mt-24"
        >
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Find Me
            </h2>
            <div className="mt-2 h-0.5 w-16 rounded-full bg-[#2d6cf7]" />
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
            <a
              href="https://www.roblox.com/users/20896161/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0f1424]/80 px-6 py-5 text-left shadow-[0_14px_45px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-[#131a2c]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1c2336] text-white shadow-inner shadow-black/40">
                  <Image
                    src="/images/roblox icon.png"
                    alt="Roblox icon"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">
                    Roblox Profile
                  </p>
                  <p className="text-sm text-white/70">View User</p>
                </div>
              </div>
              <span className="text-lg text-white/60 transition group-hover:text-white">
                →
              </span>
            </a>

            <a
              href="https://discord.com/users/yann4"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0f1424]/80 px-6 py-5 text-left shadow-[0_14px_45px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-[#131a2c]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1c2336] text-white shadow-inner shadow-black/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6 text-[#5865f2]"
                  >
                    <path d="M20 0H4C1.8 0 0 1.8 0 4v16c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4Zm-3.3 17.1s-.3-.4-.5-.8c1-.3 1.4-1 1.4-1 .3-.5.4-1 .4-1-.5.4-1 .7-1 .7-.6.3-1.2.4-1.7.3h-.1c-.1 0-.2-.1-.2-.1-.1-.1-.1-.2-.1-.2.1-.1.2-.1.2-.1 1.1-.2 1.6-.6 1.6-.6 0 0 .7-.5 1.2-1.6 0 0 .2-.5.3-1.5 0 0 .1-1.1-.4-2 0 0-.7-1.2-2.3-1.3l-.3-.1s-.2 0-.4.1c-.4-.1-1-.2-1.7-.2-.9 0-1.8.1-2.7.4 0 0-.5-.4-1.1-.5 0 0-.9-.1-2 .7 0 0-.7.8-1 2.5 0 0-.1.9.3 2 0 0 .5 1.1 1.7 1.6 0 0 .5.3 1.6.5 0 0 .1 0 .2.1 0 0 0 .1-.1.2 0 0 0 .1-.2.1-.6.1-1.2 0-1.7-.3 0 0-.4-.3-1-.7 0 0-.1 0 .4 1 0 0 .4.7 1.4 1 0 0-.2.3-.5.8 0 0-.9.1-1.8-.6 0 0-.1 0-.2-.1v.1c0 .1.1 0 .1.1 0 0 .5.7 1.9 1.2 0 0 1.1.4 2.5.5 0 0 .8.1 1.9-.1.4-.1.8-.1 1.2-.3 0 0 .1 0 .1-.1Zm-5.6-4.4c-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1 0 .7-.5 1.1-1.1 1.1Zm3.2 0c-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1-.1.7-.5 1.1-1.1 1.1Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-white">
                    Discord
                  </p>
                  <p className="text-sm text-white/70">yann4</p>
                </div>
              </div>
              <span className="text-lg text-white/60 transition group-hover:text-white">
                →
              </span>
            </a>
          </div>

          <div className="mx-auto mt-12 flex max-w-6xl items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/15 bg-[#0f172a]">
                <Image
                  src="/images/pfp.png"
                  alt="Yanns Studios logo"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <span className="font-semibold">Yanns Studios</span>
            </div>
            <span>© {new Date().getFullYear()} Yanns Studios. All rights reserved.</span>
          </div>
        </section>
      </div>
    </div>
  );
}
