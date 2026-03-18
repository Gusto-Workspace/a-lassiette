import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const testimonials = [
  {
    quote:
      "Une adresse où l’on apprécie autant la qualité de l’accueil que la générosité des assiettes. L’expérience est simple, élégante et toujours agréable.",
    author: "À l’Assiette",
    role: "Brasserie à Brive-la-Gaillarde",
  },
  {
    quote:
      "Une cuisine sincère, un service attentif et une atmosphère conviviale : tout est réuni pour profiter d’un vrai moment de plaisir à table.",
    author: "Notre maison",
    role: "Cuisine maison & de saison",
  },
  {
    quote:
      "Entre déjeuner rapide et repas plus posé, le lieu conserve la même exigence : bien recevoir, bien servir et proposer une cuisine généreuse.",
    author: "L’esprit du lieu",
    role: "Convivialité & gourmandise",
  },
];

export default function TestimonialsHomeComponent() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("right");
  const [phase, setPhase] = useState("enter");

  const changeSlide = (newDirection) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setDirection(newDirection);
    setPhase("exit");

    setTimeout(() => {
      setCurrent((prev) =>
        newDirection === "right"
          ? (prev + 1) % testimonials.length
          : (prev - 1 + testimonials.length) % testimonials.length,
      );
      setPhase("enter");

      setTimeout(() => {
        setIsAnimating(false);
      }, 650);
    }, 380);
  };

  const prevSlide = () => changeSlide("left");
  const nextSlide = () => changeSlide("right");

  const item = testimonials[current];

  const quoteExitClass =
    direction === "right"
      ? "-translate-x-10 opacity-0"
      : "translate-x-10 opacity-0";

  return (
    <section className="w-full bg-white px-5 pb-20 text-[#111111] tablet:px-8 tablet:pb-24 desktop:px-[90px] desktop:pb-[110px] ultraWild:pb-[140px]">
      <div className="mx-auto max-w-[1600px]">
        <div className="mx-auto max-w-[1380px]">
          <div className="relative flex items-center justify-center">
            {/* LEFT ARROW */}
            <button
              type="button"
              aria-label="Avis précédent"
              onClick={prevSlide}
              disabled={isAnimating}
              className="absolute left-0 top-1/2 z-20 -translate-y-1/2 text-[#b48a45] transition hover:opacity-70 disabled:pointer-events-none disabled:opacity-40 tablet:left-0 desktop:left-0"
            >
              <ArrowLeft
                size={26}
                strokeWidth={1.2}
                className="tablet:h-8 tablet:w-8 desktop:h-[34px] desktop:w-[34px]"
              />
            </button>

            {/* CENTER CONTENT */}
            <div className="mx-auto w-full max-w-[980px] px-10 text-center tablet:px-14 desktop:px-20 ultraWild:px-0">
              <div className="mb-6 flex justify-center tablet:mb-8">
                <Image
                  src="/img/testimonials/quote.png"
                  alt="Quote"
                  width={75}
                  height={75}
                  className="object-cover "
                />
              </div>

              <div className="relative min-h-[260px] tablet:min-h-[240px] desktop:min-h-[220px]">
                {/* QUOTE */}
                <h2
                  className={`yeseva-one-regular text-[22px] uppercase leading-[1.22] text-[#111111] transition-all duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] tablet:text-[24px] desktop:text-[28px] ${
                    phase === "exit"
                      ? quoteExitClass
                      : phase === "enter"
                        ? "translate-x-0 opacity-100 delay-[80ms]"
                        : ""
                  }`}
                >
                  {item.quote}
                </h2>

                {/* AUTHOR + ROLE */}
                <div className="mt-10 tablet:mt-12">
                  <p
                    className={`text-[12px] font-medium uppercase tracking-[0.24em] text-[#b48a45] transition-all duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] tablet:text-[13px] tablet:tracking-[0.3em] desktop:text-[14px] desktop:tracking-[0.34em] ${
                      phase === "exit"
                        ? "translate-y-3 opacity-0"
                        : "translate-y-0 opacity-100 delay-[180ms]"
                    }`}
                  >
                    {item.author}
                  </p>

                  <p
                    className={`mt-3 text-[16px] font-light leading-[1.5] text-black/65 transition-all duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] tablet:mt-4 tablet:text-[18px] desktop:text-[20px] ${
                      phase === "exit"
                        ? "translate-y-3 opacity-0"
                        : "translate-y-0 opacity-100 delay-[280ms]"
                    }`}
                  >
                    {item.role}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT ARROW */}
            <button
              type="button"
              aria-label="Avis suivant"
              onClick={nextSlide}
              disabled={isAnimating}
              className="absolute right-0 top-1/2 z-20 -translate-y-1/2 text-[#b48a45] transition hover:opacity-70 disabled:pointer-events-none disabled:opacity-40 tablet:right-0 desktop:right-0"
            >
              <ArrowRight
                size={26}
                strokeWidth={1.2}
                className="tablet:h-8 tablet:w-8 desktop:h-[34px] desktop:w-[34px]"
              />
            </button>
          </div>
        </div>

        <div className="relative mt-14 h-[72px] w-full tablet:mt-20 tablet:h-[95px] desktop:mt-24 desktop:h-[120px] ultraWild:h-[140px]">
          <Image
            src="/img/testimonials/badges.png"
            alt="badges"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}