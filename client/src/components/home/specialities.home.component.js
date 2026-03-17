import Image from "next/image";

export default function SpecialtiesHomeComponent() {
  return (
    <section className="w-full bg-[#f3f3f3] px-[90px] py-[140px] text-[#111111]">
      <div className="mx-auto max-w-[1600px]">
        {/* TITLE */}
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="text-[54px] uppercase leading-[1.06] tracking-[-0.04em] yeseva-one-regular">
            Une cuisine généreuse,
            <br />
            faite maison et de saison
          </h2>
        </div>

        {/* CONTENT */}
        <div className="relative mt-[120px] flex items-center justify-center">
          <div className="relative flex w-full max-w-[1220px] items-center justify-between">
            {/* LEFT IMAGE */}
            <div className="relative h-[620px] w-[390px] shrink-0 overflow-hidden">
              <Image
                src="/img/specialities/1.jpg"
                alt="Table view"
                fill
                className="object-cover"
              />
            </div>

            {/* CENTER OVERLAY IMAGE */}
            <div className="absolute left-[240px] top-1/2 z-20 h-[430px] w-[430px] -translate-y-1/2 overflow-hidden">
              <Image
                src="/img/specialities/2.jpg"
                alt="Cocktail"
                fill
                className="object-cover"
              />
            </div>

            {/* RIGHT TEXT */}
            <div className="ml-auto w-[430px] pt-[10px]">
              <p className="mb-6 text-[16px] font-light uppercase tracking-[0.38em] text-[#b48a45]">
                Notre cuisine
              </p>

              <h3 className="text-[26px] uppercase leading-[1.08] tracking-[-0.04em] yeseva-one-regular">
                Une expérience gourmande à partager à chaque instant
              </h3>

              <p className="mt-8 text-[18px] font-light leading-[1.7] text-black/55 ">
                À l’Assiette, chaque plat est préparé avec soin à partir de
                produits frais et de saison. La cuisine met à l’honneur une
                brasserie conviviale, mêlant tradition et créativité, avec des
                recettes simples, maîtrisées et toujours gourmandes. Situé à
                l’entrée ouest de Brive-la-Gaillarde, l’établissement propose
                une cuisine accessible et authentique, idéale pour un déjeuner
                rapide comme pour un moment plus détendu entre amis ou en
                famille.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
