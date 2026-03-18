import Image from "next/image";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const images = ["/img/hero/1.jpg", "/img/hero/2.jpg", "/img/hero/3.jpg"];

export default function HeroSectionHomeComponent() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[760px] w-full overflow-hidden bg-[#022401] text-white tablet:min-h-[860px] desktop:h-screen desktop:min-h-[900px]">
      <div className="relative h-full min-h-[760px] w-full tablet:min-h-[860px] desktop:min-h-[900px]">
        {/* IMAGE */}
        <div className="absolute inset-0 overflow-hidden desktop:left-[30%] desktop:top-[102px] desktop:h-[695px] desktop:w-full ultraWild:left-[30%]">
          {images.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt=""
              fill
              priority
              className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/65 desktop:bg-gradient-to-r desktop:from-black/60 desktop:via-black/20 desktop:to-transparent" />
        </div>

        {/* LEFT ARROW */}
        <button
          type="button"
          aria-label="Previous slide"
          className="absolute left-[58px] top-[452px] z-20 hidden items-center text-[#b48a45] desktop:flex"
          onClick={() =>
            setCurrent((prev) => (prev - 1 + images.length) % images.length)
          }
        >
          <ArrowLeft size={28} strokeWidth={1.2} />
          <span className="-ml-3 h-px w-[34px] bg-[#b48a45]" />
        </button>

        {/* RIGHT ARROW */}
        <button
          type="button"
          aria-label="Next slide"
          className="absolute right-[58px] top-[452px] z-20 hidden items-center text-[#b48a45] desktop:flex"
          onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
        >
          <span className="-mr-3 h-px w-[34px] bg-[#b48a45]" />
          <ArrowRight size={28} strokeWidth={1.2} />
        </button>

        {/* TEXT BLOCK */}
        <div className="absolute left-0 top-[110px] z-20 w-full px-5 tablet:top-[130px] tablet:px-8 desktop:left-[142px] desktop:top-[272px] desktop:w-[720px] desktop:px-0">
          <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-white tablet:mb-5 tablet:text-[13px] tablet:tracking-[0.34em] desktop:mb-7 desktop:text-[16px] desktop:tracking-[0.42em]">
            Brasserie Brive-la-Gaillarde
          </p>

          <h1 className="yeseva-one-regular max-w-[320px] text-[44px] leading-[0.95] tracking-[-0.04em] text-white tablet:max-w-[520px] tablet:text-[64px] desktop:max-w-none desktop:text-[88px] desktop:leading-[0.92]">
            A l&apos;Assiette
          </h1>

          <p className="mt-5 max-w-[92%] text-[16px] font-extralight leading-[1.6] text-white/75 tablet:mt-6 tablet:max-w-[620px] tablet:text-[19px] desktop:mt-8 desktop:text-[23px] desktop:leading-[1.55] desktop:text-white/58">
            Véritable havre de paix, la brasserie à l&apos;assiette vous attend
            du lundi au samedi. Située à l&apos;entrée de la zone ouest de
            Brive-la-Gaillarde, à 3 minutes de la sortie autoroutière n°51.
          </p>
        </div>

        {/* BOOKING BAR */}
        <div className="absolute bottom-6 left-5 right-5 z-30 flex flex-col gap-3 rounded-none p-0 tablet:bottom-8 tablet:left-8 tablet:right-8 tablet:gap-4 desktop:bottom-[52px] desktop:left-[10%] desktop:right-[10%] desktop:flex-row desktop:items-center desktop:gap-6 desktop:bg-transparent desktop:backdrop-blur-0">
          <div className="mb-1 shrink-0 desktop:mb-0">
            <h2 className="yeseva-one-regular text-[26px] leading-[0.95] tracking-[-0.03em] text-white tablet:text-[30px] desktop:text-[22px] desktop:leading-[0.9]">
              Réserver une table
            </h2>
          </div>

          <button
            type="button"
            className="flex h-[52px] w-full items-center justify-between border border-white/20 px-5 text-left text-[16px] font-light text-white/90 tablet:px-6 tablet:text-[17px] desktop:w-[232px] desktop:text-[18px]"
          >
            <span>1 Personne</span>
            <ChevronDown size={18} strokeWidth={1.4} />
          </button>

          <button
            type="button"
            className="flex h-[52px] w-full items-center justify-between border border-white/20 px-5 text-left text-[16px] font-light text-white/90 tablet:px-6 tablet:text-[17px] desktop:w-[232px] desktop:text-[18px]"
          >
            <span>15.05.2026</span>
            <ChevronDown size={18} strokeWidth={1.4} />
          </button>

          <button
            type="button"
            className="flex h-[52px] w-full items-center justify-between border border-white/20 px-5 text-left text-[16px] font-light text-white/90 tablet:px-6 tablet:text-[17px] desktop:w-[232px] desktop:text-[18px]"
          >
            <span>11:00</span>
            <ChevronDown size={18} strokeWidth={1.4} />
          </button>

          <button
            type="button"
            className="flex h-[52px] w-full items-center justify-center bg-[#bb924b] text-[12px] px-2 font-medium uppercase tracking-[0.22em] text-white tablet:text-[13px] desktop:ml-auto desktop:w-[182px] desktop:text-[14px] desktop:tracking-[0.28em]"
          >
            <span className="mr-2 text-[10px] opacity-80">◆</span>
            Valider
            <span className="ml-2 text-[10px] opacity-80">◆</span>
          </button>
        </div>
      </div>
    </section>
  );
}