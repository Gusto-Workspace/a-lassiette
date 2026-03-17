import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function TimelineHomeComponent() {
  const sectionRef = useRef(null);

  const items = [
    {
      label: "BRIVE OUEST",
      title: "UN EMPLACEMENT PRATIQUE",
      text: "Situé à l’entrée de la zone ouest de Brive-la-Gaillarde, le restaurant est facilement accessible, à seulement quelques minutes de la sortie autoroutière n°51.",
      badge: "seal",
    },
    {
      label: "130 PLACES",
      title: "UN LIEU PENSÉ POUR RECEVOIR",
      text: "À l’Assiette se présente comme une brasserie de 130 places assises, pensée pour accueillir aussi bien les déjeuners du quotidien que les repas plus posés.",
      badge: "diamond",
    },
    {
      label: "CUISINE",
      title: "TRADITION & TERROIR",
      text: "Le restaurant met en avant une cuisine traditionnelle et terroir, dans un esprit brasserie généreux, accessible et gourmand.",
      badge: "triangle",
    },
    {
      label: "SERVICES",
      title: "CONFORT AU QUOTIDIEN",
      text: "Terrasse, climatisation, wifi et accès PMR font partie des services proposés sur place.",
      badge: "hex",
    },
    {
      label: "À LA CARTE",
      title: "DES PLATS SIGNATURES",
      text: "La carte actuelle met notamment en avant le ris de veau, l’andouillette sauce moutarde à l’ancienne, le Burger de l’Assiette ou encore la tarte Tatin.",
      badge: "round",
    },
  ];

  useEffect(() => {
    let ctx;

    const init = async () => {
      if (!sectionRef.current || typeof window === "undefined") return;

      const { ScrollTrigger } = await import("gsap/dist/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray(".timeline-card");
        const dots = gsap.utils.toArray(".timeline-dot");
        const badges = gsap.utils.toArray(".timeline-badge");
        const line = sectionRef.current.querySelector(
          ".timeline-line-progress",
        );

        gsap.set(cards, {
          opacity: 0,
          y: (index) => (index % 2 === 0 ? 50 : -50),
        });

        gsap.set(dots, {
          scale: 0,
          rotate: 45,
        });

        gsap.set(badges, {
          opacity: 0,
          scale: 0.8,
        });

        gsap.set(line, {
          scaleX: 0,
          transformOrigin: "left center",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "bottom 90%",
            scrub: 1.1,
          },
        });

        tl.to(
          line,
          {
            scaleX: 1,
            ease: "none",
          },
          0,
        );

        dots.forEach((dot, index) => {
          tl.to(
            dot,
            {
              scale: 1,
              duration: 0.2,
              ease: "power2.out",
            },
            index * 0.18,
          );
        });

        cards.forEach((card, index) => {
          tl.to(
            card,
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: "power3.out",
            },
            index * 0.18 + 0.04,
          );
        });

        badges.forEach((badge, index) => {
          tl.to(
            badge,
            {
              opacity: 0.35,
              scale: 1,
              duration: 0.24,
              ease: "power2.out",
            },
            index * 0.18 + 0.08,
          );
        });
      }, sectionRef);
    };

    init();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-hidden bg-[#f3f3f3] py-[140px]"
    >
      <div className="relative overflow-x-auto custom-scrollbar overflow-y-hidden scrollbar-none">
        <div className="w-max min-w-max px-[90px]">
          <div className="relative">
            <div className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-[#b48a45]/20" />
            <div className="timeline-line-progress absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-[#b48a45]" />

            <div className="relative grid grid-cols-5">
              {items.map((item, index) => {
                const isTop = index % 2 === 1;

                return (
                  <div
                    key={index}
                    className="relative flex min-h-[520px] w-[380px] flex-col items-center"
                  >
                    {/* TOP */}
                    <div className="flex h-1/2 w-full items-end justify-center pb-[72px]">
                      {isTop ? (
                        <div className="timeline-card w-full max-w-[380px] text-left">
                          <p className="mb-3 text-[14px] tracking-[0.35em] text-[#b48a45]">
                            {item.label}
                          </p>

                          <h3 className="yeseva-one-regular text-[28px] uppercase leading-[1.05] tracking-[-0.03em] text-[#171717] xl:text-[30px]">
                            {item.title}
                          </h3>

                          <p className="mt-4 text-[16px] leading-[1.8] text-black/60">
                            {item.text}
                          </p>
                        </div>
                      ) : (
                        <div className="timeline-badge flex items-center justify-center opacity-30">
                          <Badge type={item.badge} />
                        </div>
                      )}
                    </div>

                    {/* DOT */}
                    <div className="relative z-10 flex h-0 items-center justify-center">
                      <div className="timeline-dot h-[12px] w-[12px] rotate-45 bg-[#b48a45]" />
                    </div>

                    {/* BOTTOM */}
                    <div className="flex h-1/2 w-full items-start justify-center pt-[72px]">
                      {!isTop ? (
                        <div className="timeline-card w-full max-w-[380px] text-left">
                          <p className="mb-3 text-[14px] tracking-[0.35em] text-[#b48a45]">
                            {item.label}
                          </p>

                          <h3 className="yeseva-one-regular text-[28px] uppercase leading-[1.05] tracking-[-0.03em] text-[#171717] xl:text-[30px]">
                            {item.title}
                          </h3>

                          <p className="mt-4 text-[16px] leading-[1.8] text-black/60">
                            {item.text}
                          </p>
                        </div>
                      ) : (
                        <div className="timeline-badge flex items-center justify-center opacity-30">
                          <Badge type={item.badge} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ type = "seal" }) {
  const cls = "h-[92px] w-[92px] text-[#c8b27a]";

  switch (type) {
    case "diamond":
      return (
        <svg viewBox="0 0 100 100" className={cls} fill="none">
          <path
            d="M50 8L92 50L50 92L8 50L50 8Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M50 20L80 50L50 80L20 50L50 20Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="M4 50H20" stroke="currentColor" strokeWidth="1.2" />
          <path d="M80 50H96" stroke="currentColor" strokeWidth="1.2" />
          <text
            x="50"
            y="46"
            textAnchor="middle"
            fontSize="8"
            fill="currentColor"
            fontFamily="serif"
          >
            130
          </text>
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fontSize="7"
            fill="currentColor"
            fontFamily="serif"
          >
            PLACES
          </text>
        </svg>
      );

    case "triangle":
      return (
        <svg viewBox="0 0 100 100" className={cls} fill="none">
          <path
            d="M50 10L88 78H12L50 10Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M50 24L75 69H25L50 24Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <text
            x="50"
            y="50"
            textAnchor="middle"
            fontSize="7"
            fill="currentColor"
            fontFamily="serif"
          >
            CUISINE
          </text>
          <text
            x="50"
            y="61"
            textAnchor="middle"
            fontSize="7"
            fill="currentColor"
            fontFamily="serif"
          >
            TERROIR
          </text>
        </svg>
      );

    case "round":
      return (
        <svg viewBox="0 0 100 100" className={cls} fill="none">
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <circle
            cx="50"
            cy="50"
            r="29"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <text
            x="50"
            y="40"
            textAnchor="middle"
            fontSize="6.5"
            fill="currentColor"
            fontFamily="serif"
          >
            PLATS
          </text>
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fontSize="8"
            fill="currentColor"
            fontFamily="serif"
          >
            SIGNATURES
          </text>
          <text
            x="50"
            y="67"
            textAnchor="middle"
            fontSize="6.5"
            fill="currentColor"
            fontFamily="serif"
          >
            MAISON
          </text>
        </svg>
      );

    case "hex":
      return (
        <svg viewBox="0 0 100 100" className={cls} fill="none">
          <path
            d="M28 22H72L90 36V64L72 78H28L10 64V36L28 22Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M3 50H24" stroke="currentColor" strokeWidth="1.2" />
          <path d="M76 50H97" stroke="currentColor" strokeWidth="1.2" />
          <text
            x="50"
            y="45"
            textAnchor="middle"
            fontSize="7"
            fill="currentColor"
            fontFamily="serif"
          >
            WIFI
          </text>
          <text
            x="50"
            y="57"
            textAnchor="middle"
            fontSize="7"
            fill="currentColor"
            fontFamily="serif"
          >
            PMR
          </text>
          <text
            x="50"
            y="69"
            textAnchor="middle"
            fontSize="7"
            fill="currentColor"
            fontFamily="serif"
          >
            TERRASSE
          </text>
        </svg>
      );

    case "seal":
    default:
      return (
        <svg viewBox="0 0 100 100" className={cls} fill="none">
          <path
            d="M50 10
               C55 10,58 15,62 16
               C66 17,71 15,74 18
               C77 21,77 26,80 30
               C83 34,88 36,89 40
               C90 44,87 48,87 50
               C87 52,90 56,89 60
               C88 64,83 66,80 70
               C77 74,77 79,74 82
               C71 85,66 83,62 84
               C58 85,55 90,50 90
               C45 90,42 85,38 84
               C34 83,29 85,26 82
               C23 79,23 74,20 70
               C17 66,12 64,11 60
               C10 56,13 52,13 50
               C13 48,10 44,11 40
               C12 36,17 34,20 30
               C23 26,23 21,26 18
               C29 15,34 17,38 16
               C42 15,45 10,50 10Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle
            cx="50"
            cy="50"
            r="22"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <text
            x="50"
            y="44"
            textAnchor="middle"
            fontSize="6.5"
            fill="currentColor"
            fontFamily="serif"
          >
            BRIVE
          </text>
          <text
            x="50"
            y="56"
            textAnchor="middle"
            fontSize="7"
            fill="currentColor"
            fontFamily="serif"
          >
            OUEST
          </text>
        </svg>
      );
  }
}
