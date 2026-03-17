import Image from "next/image";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";

import { useState, useEffect } from "react";

const images = ["/img/hero/1.jpg", "/img/hero/2.jpg", "/img/hero/3.jpg"];

export default function HeroSectionHomeComponent() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // change toutes les 5s

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative h-screen min-h-[900px] w-full overflow-hidden bg-[#022401] text-white">
      <div className="relative h-full w-full">
        {/* IMAGE */}
        <div className="absolute left-[30%] top-[102px] h-[695px] w-full overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </div>

        {/* LEFT ARROW */}
        <button
          type="button"
          aria-label="Previous slide"
          className="absolute left-[58px] top-[452px] z-20 flex items-center text-[#b48a45]"
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
          className="absolute right-[58px] top-[452px] z-20 flex items-center text-[#b48a45]"
          onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
        >
          <span className="-mr-3 h-px w-[34px] bg-[#b48a45]" />
          <ArrowRight size={28} strokeWidth={1.2} />
        </button>

        {/* TEXT BLOCK */}
        <div className="absolute left-[142px] top-[272px] z-20 w-[720px]">
          <p className="mb-7 text-[16px] uppercase tracking-[0.42em] text-white">
            Brasserie Brive-la-Gaillarde
          </p>

          <h1 className="text-[88px] yeseva-one-regular leading-[0.92] tracking-[-0.04em] text-white">
            A l'Assiette
          </h1>

          <p className="mt-8 max-w-[620px] text-[23px] font-extralight leading-[1.55] text-white/58">
            Véritable havre de paix, la brasserie à l'assiette vous attend du
            lundi au samedi. Située à l'entrée de la zone ouest de
            Brive-la-Gaillarde, à 3 minutes de la sortie autoroutière n°51.
          </p>
        </div>

        {/* BOOKING BAR */}
        <div className="absolute bottom-[52px] left-[142px] right-[142px] z-30 flex items-center gap-6">
          <div className="w-[260px] shrink-0">
            <h2 className="text-[22px] yeseva-one-regular leading-[0.9] tracking-[-0.03em] text-white ">
              Réserver une table
            </h2>
          </div>

          <button
            type="button"
            className="flex h-[52px] w-[232px] items-center justify-between border border-white/20 px-6 text-left text-[18px] font-light text-white/90"
          >
            <span>1 Personne</span>
            <ChevronDown size={18} strokeWidth={1.4} />
          </button>

          <button
            type="button"
            className="flex h-[52px] w-[232px] items-center justify-between border border-white/20 px-6 text-left text-[18px] font-light text-white/90"
          >
            <span>15.05.2026</span>
            <ChevronDown size={18} strokeWidth={1.4} />
          </button>

          <button
            type="button"
            className="flex h-[52px] w-[232px] items-center justify-between border border-white/20 px-6 text-left text-[18px] font-light text-white/90"
          >
            <span>11:00</span>
            <ChevronDown size={18} strokeWidth={1.4} />
          </button>

          <button
            type="button"
            className="ml-auto flex h-[52px] w-[182px] items-center justify-center bg-[#bb924b] text-[14px] font-medium uppercase tracking-[0.28em] text-white"
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
