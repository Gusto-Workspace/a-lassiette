import Image from "next/image";

export default function ExperienceHomeComponent() {
  return (
    <section className="w-full bg-[#ffffff] pt-[140px] text-[#111111]">
      <div className="mx-auto px-[90px] max-w-[1600px]">
        {/* CONTENT */}
        <div className="relative flex items-start justify-center">
          <div className="relative flex w-full max-w-[1220px] items-start justify-between">
            {/* LEFT TEXT */}
            <div className="mr-auto flex flex-col items-center w-[430px] pt-[10px]">
              <h3 className="text-[32px] text-balance uppercase leading-[1.08] tracking-[-0.04em] yeseva-one-regular">
                Le goût du détail, au cœur de chaque assiette
              </h3>

              <p className="mt-6 text-[18px] font-light leading-[1.9] text-black/55">
                Ici, chaque service est pensé comme un moment à part. Les gestes
                sont précis, les cuissons maîtrisées, et chaque assiette est
                dressée avec attention pour révéler pleinement les saveurs.
              </p>

              <p className="mt-2 text-[18px] font-light leading-[1.9] text-black/55">
                Entre simplicité assumée et exigence constante, la cuisine
                s’exprime avec justesse, offrant une expérience sincère, où le
                plaisir passe avant tout.
              </p>

              <p className="mt-2 text-[18px] font-light leading-[1.9] text-black/55">
                Un lieu où l’on revient autant pour la qualité des plats que
                pour l’atmosphère chaleureuse qui accompagne chaque moment passé
                à table.
              </p>

              <div className="mt-14 rounded-full">
                <Image
                  src="/img/logo.png"
                  alt="Signature"
                  width={120}
                  height={120}
                  className="opacity-90 rounded-full"
                />
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="bg-[#f3f3f3] absolute right-[240px] top-1/2 z-20 h-[430px] w-[430px] -translate-y-1/2 overflow-hidden">
              <Image
                src="/img/specialities/1.jpg"
                alt="Table view"
                fill
                className="object-cover"
              />
            </div>

            {/* CENTER OVERLAY IMAGE */}
            <div className="relative h-[620px] w-[390px] shrink-0 overflow-hidden">
              <Image
                src="/img/specialities/2.jpg"
                alt="dish"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT VISUALS */}
      <div className="relative h-[760px] w-full mt-48">
        {/* BIG IMAGE (RIGHT) */}
        <div className="absolute right-0 top-0 h-[620px] w-[60vw] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
          <Image
            src="/img/experience/4.jpg"
            alt="Salle du restaurant"
            fill
            className="object-cover"
          />
        </div>

        {/* SMALL IMAGE (LEFT OVERLAY) */}
        <div className="absolute left-0 -top-[60px] z-20 h-[620px] w-[35vw] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
          <Image
            src="/img/experience/3.jpg"
            alt="Cocktail signature"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
