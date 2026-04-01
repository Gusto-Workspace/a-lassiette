import Image from "next/image";
import MenuInspiredHomeComponent from "../home/menu-inspired.home.component";
import { ChevronDown } from "lucide-react";

function formatPrice(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return value || "";
  }

  return `${numericValue.toFixed(2).replace(".", ",")} €`;
}

function getVisibleMenuCategories(restaurantData) {
  return (restaurantData?.dish_categories || [])
    .filter(
      (category) =>
        category?.visible &&
        Array.isArray(category?.dishes) &&
        category.dishes.some((dish) => dish?.showOnWebsite),
    )
    .map((category) => ({
      id: category?._id || category?.name,
      title: category?.name || "",
      description: category?.description || "",
      items: (category?.dishes || [])
        .filter((dish) => dish?.showOnWebsite)
        .map((dish) => ({
          id: dish?._id || dish?.name,
          name: dish?.name || "",
          description: dish?.description || "",
          price: formatPrice(dish?.price),
        })),
    }))
    .filter((category) => category.title && category.items.length > 0);
}

function MenuItem({ name, price, description }) {
  return (
    <div className="pb-5 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <h4 className="max-w-[70%] text-[15px] font-medium uppercase tracking-[0.22em] text-[#111111] tablet:text-[16px]">
          {name}
        </h4>

        <div className="mt-[11px] hidden min-w-0 flex-1 tablet:block">
          <div className="h-px w-full bg-[radial-gradient(circle,_#b48a45_1.1px,_transparent_1.1px)] bg-[length:12px_2px] bg-repeat-x" />
        </div>

        <span className="shrink-0 text-[15px] font-semibold tracking-[0.08em] text-[#111111] tablet:text-[16px]">
          {price}
        </span>
      </div>

      {description ? (
        <p className="mt-2 pr-6 text-[17px] font-light leading-[1.7] text-black/55 whitespace-pre-line">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function CategoryBlock({ title, items }) {
  return (
    <div className="pb-4 tablet:pb-12">
      <h3 className="w-full mb-12 text-center text-[28px] uppercase leading-[1.08] tracking-[-0.04em] text-[#111111] yeseva-one-regular tablet:text-[34px]">
        {title}
      </h3>

      <div className="grid grid-cols-1 gap-x-16 gap-y-6 tablet:grid-cols-2">
        {items.map((item) => (
          <MenuItem
            key={item.id || `${title}-${item.name}`}
            name={item.name}
            price={item.price}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}

export default function FullMenuHomeComponent({ restaurantData }) {
  const menuCategories = getVisibleMenuCategories(restaurantData);

  return (
    <section className="w-full bg-[#eeebe6] pt-[90px] text-[#111111]">
      <div className=" text-[#111111] mx-auto max-w-[1600px] px-6 tablet:px-[50px] desktop:px-[90px]">
        {/* TITLE */}
        <div className="mx-auto max-w-[980px] text-center">
          <p className="mb-5 text-[13px] font-light uppercase tracking-[0.42em] text-[#b48a45] tablet:text-[16px]">
            Carte
          </p>

          <h2 className="yeseva-one-regular text-[38px] uppercase leading-[1.02] tracking-[-0.04em] tablet:text-[54px]">
            Notre carte
          </h2>

          <p className="mx-auto mt-5 max-w-[760px] text-[17px] font-light leading-[1.8] text-black/55 tablet:text-[18px]">
            Une cuisine généreuse, de saison, entre tradition, gourmandise et
            produits de caractère.
          </p>
        </div>

        {/* CONTENT */}
        <div className="mt-16 space-y-16">
          {menuCategories.map((category) => (
            <CategoryBlock
              key={category.id || category.title}
              title={category.title}
              items={category.items}
            />
          ))}
        </div>

        <div className="mt-12 h-[140px] relative w-full">
          <Image
            src="/img/testimonials/badges.png"
            alt="badges"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative w-full mt-[90px]">
        <div className="block h-[650px] w-full overflow-hidden">
          <Image
            src="/img/hero/2.jpg"
            alt="Présentation du restaurant"
            fill
            className="object-cover"
            priority={false}
          />

          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>

      <div className="bg-white px-5 tablet:px-[90px] pb-[60px] desktop:pb-0 relative">
        <div className="-translate-y-[325px]">
          <MenuInspiredHomeComponent menusPage={true} />
        </div>

        {/* BOOKING BAR */}
        <div className="absolute bottom-6 left-5 right-5 z-30 flex flex-col gap-3 rounded-none p-0 tablet:bottom-8 tablet:left-8 tablet:right-8 tablet:gap-4 desktop:bottom-[130px] desktop:left-[10%] desktop:right-[10%] desktop:flex-row desktop:items-center desktop:gap-6 desktop:bg-transparent desktop:backdrop-blur-0">
          <div className="mb-1 shrink-0 desktop:mb-0">
            <h2 className="yeseva-one-regular text-center tablet:text-left text-[26px] leading-[0.95] tracking-[-0.03em] text-[#022401] tablet:text-[30px] desktop:text-[22px] desktop:leading-[0.9]">
              Réserver une table
            </h2>
          </div>

          <button
            type="button"
            className="flex h-[52px] w-full items-center justify-between border border-[#022401]/20 px-5 text-left text-[16px] font-light text-[#022401]/90 tablet:px-6 tablet:text-[17px] desktop:w-[232px] desktop:text-[18px]"
          >
            <span>1 Personne</span>
            <ChevronDown size={18} strokeWidth={1.4} />
          </button>

          <button
            type="button"
            className="flex h-[52px] w-full items-center justify-between border border-[#022401]/20 px-5 text-left text-[16px] font-light text-[#022401]/90 tablet:px-6 tablet:text-[17px] desktop:w-[232px] desktop:text-[18px]"
          >
            <span>15.05.2026</span>
            <ChevronDown size={18} strokeWidth={1.4} />
          </button>

          <button
            type="button"
            className="flex h-[52px] w-full items-center justify-between border border-[#022401]/20 px-5 text-left text-[16px] font-light text-[#022401]/90 tablet:px-6 tablet:text-[17px] desktop:w-[232px] desktop:text-[18px]"
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
