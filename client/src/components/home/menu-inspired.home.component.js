import Image from "next/image";

const lunchMenuLeft = [
  {
    title: "Entrée + Plat",
    price: "17,00 EUR",
    items: [
      "Œuf Bio Mimosa, condiments acidulés",
      "Ou",
      "Velouté du moment Ou Pâté en croûte de canard",
      "Plat du jour (voir ardoise)",
    ],
  },
];

const lunchMenuRight = [
  {
    title: "Plat + Dessert",
    price: "17,00 EUR",
    items: [
      "Plat du jour (voir ardoise)",
      "Pâtisserie du jour",
      "Ou",
      "Faisselle, coulis de rhubarbe",
    ],
  },
];

function MenuCard({ title, price, items }) {
  return (
    <div className="border-b border-[#c7b79a]/35 pb-8 last:border-b-0 last:pb-0">
      <div className="flex items-end justify-between gap-6">
        <h4 className="text-[24px] uppercase leading-none tracking-[0.08em] text-[#111111] yeseva-one-regular">
          {title}
        </h4>

        <div className="flex min-w-fit items-center gap-4">
          <div className="hidden h-px w-[110px] bg-[radial-gradient(circle,_#b48a45_1.2px,_transparent_1.2px)] bg-[length:12px_2px] bg-repeat-x md:block" />
          <span className="text-[20px] font-semibold tracking-[0.08em] text-[#b48a45]">
            {price}
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item, index) => {
          const isSeparator = item.toLowerCase() === "ou";

          return (
            <p
              key={`${title}-${index}`}
              className={
                isSeparator
                  ? "text-[16px] uppercase tracking-[0.28em] text-[#b48a45]"
                  : "text-[19px] font-light leading-[1.65] text-black/60"
              }
            >
              {item}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default function MenuInspiredHomeComponent(props) {
  return (
    <section className="w-full bg-[#eeebe6] text-[#111111] px-[90px] py-[140px]">
      <div className="mx-auto max-w-[1600px]">
        {/* TITLE */}
        <div className="mx-auto max-w-[1000px] text-center">
          <p className="mb-5 text-[14px] font-light uppercase tracking-[0.42em] text-[#b48a45] md:text-[16px]">
            {!props.menusPage ? "Carte et menus" : "Menus"}
          </p>

          <h2 className="text-[40px] uppercase leading-[1.04] tracking-[-0.04em] md:text-[54px] yeseva-one-regular">
            Notre formule du midi
          </h2>

          <h3 className="yeseva-one-regular mt-2">du lundi au vendredi</h3>
        </div>

        {/* CONTENT */}
        <div className="mt-[70px] grid items-center grid-cols-[470px_minmax(0,1fr)] gap-[80px]">
          {/* LEFT IMAGE */}
          <div className="relative mx-auto w-full max-w-[470px]">
            <div className="relative overflow-hidden border border-[#b48a45] p-4 rounded-t-[240px]">
              <div className="relative overflow-hidden rounded-t-[240px] h-[570px]">
                <Image
                  src="/img/menu-inspired/1.webp"
                  alt="Cuisine et dressage à l'assiette"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* BADGE */}
            <div className="absolute bottom-[-22px] left-1/2 z-10 flex h-[88px] w-[88px] -translate-x-1/2 items-center justify-center rounded-full border border-[#d4bf96] bg-[#b48a45] text-center text-[10px] uppercase tracking-[0.18em] text-white">
              <span className="-mt-2">
                À
                <br />
                l’Assiette
              </span>
            </div>
          </div>

          {/* RIGHT MENUS */}
          <div className="grid gap-8">
            {/* LEFT COLUMN */}

            {lunchMenuLeft.map((menu) => (
              <MenuCard
                key={menu.title}
                title={menu.title}
                price={menu.price}
                items={menu.items}
              />
            ))}

            {/* RIGHT COLUMN */}

            {lunchMenuRight.map((menu) => (
              <MenuCard
                key={menu.title}
                title={menu.title}
                price={menu.price}
                items={menu.items}
              />
            ))}

            {/* BUTTON */}
            {!props.menusPage && (
              <div className="flex justify-center">
                <button
                  type="button"
                  className="flex h-[52px] w-[220px] items-center justify-center bg-[#bb924b] text-[14px] font-medium uppercase tracking-[0.28em] text-white hover:opacity-90 transition"
                >
                  <span className="mr-2 text-[10px] opacity-80">◆</span>
                  Voir la carte
                  <span className="ml-2 text-[10px] opacity-80">◆</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
