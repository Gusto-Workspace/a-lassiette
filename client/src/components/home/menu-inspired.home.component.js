import Image from "next/image";
import { useContext } from "react";
import { useRouter } from "next/router";
import { GlobalContext } from "@/contexts/global.context";
import {
  buildMenuBlocks,
  getMenuTitle,
  getPrimaryMenu,
  isMenuBlankLine,
  isMenuSeparatorLabel,
} from "../../_assets/utils/menu-display.utils";

function MenuCard({ title, price, items = [] }) {
  return (
    <div className="border-b border-[#c7b79a]/35 pb-7 text-center last:border-b-0 last:pb-0 tablet:pb-8 min-[1180px]:text-left">
      <div className="grid grid-cols-1 gap-3 min-[900px]:grid-cols-[minmax(0,1fr)_auto] min-[900px]:items-center min-[900px]:gap-5">
        <h4 className="yeseva-one-regular min-w-0 text-[22px] uppercase leading-none tracking-[0.04em] text-[#111111] tablet:text-[24px] min-[900px]:whitespace-nowrap tablet:tracking-[0.06em]">
          {title}
        </h4>

        {price ? (
          <div className="flex min-w-0 items-center justify-center gap-3 min-[900px]:justify-end tablet:gap-4">
            <div className="hidden h-px min-w-[24px] flex-1 bg-[radial-gradient(circle,_#b48a45_1.1px,_transparent_1.1px)] bg-[length:8px_2px] bg-repeat-x min-[900px]:block min-[900px]:max-w-[180px]" />
            <span className="shrink-0 whitespace-nowrap text-[18px] font-semibold tracking-[0.08em] text-[#b48a45] tablet:text-[20px]">
              {price}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 tablet:mt-5">
        {items.map((item, index) => {
          const isSeparator = isMenuSeparatorLabel(item);
          const isBlankLine = isMenuBlankLine(item);
          const previousItem = index > 0 ? items[index - 1] : null;
          const followsBlankLine = isMenuBlankLine(previousItem);
          const spacingClass =
            index === 0 || followsBlankLine ? "" : "mt-2.5 tablet:mt-3";

          if (isBlankLine) {
            return (
              <div
                key={`${title}-${index}`}
                className={
                  index === 0 ? "h-[1.1em]" : "mt-2.5 tablet:mt-3 h-[1.1em]"
                }
                aria-hidden="true"
              />
            );
          }

          return (
            <p
              key={`${title}-${index}`}
              className={[
                spacingClass,
                isSeparator
                  ? "text-[14px] uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[16px] tablet:tracking-[0.28em]"
                  : "text-[17px] font-light leading-[1.65] text-black/60 tablet:text-[18px] min-[1180px]:text-[19px]",
              ]
                .join(" ")
                .trim()}
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
  const router = useRouter();
  const { restaurantContext } = useContext(GlobalContext);

  const restaurantData =
    props.restaurantData || restaurantContext?.restaurantData;
  const featuredMenu = props.menu || getPrimaryMenu(restaurantData);

  if (!featuredMenu) {
    return null;
  }

  const featuredMenuBlocks = buildMenuBlocks(featuredMenu);

  return (
    <section className="w-full bg-[#eeebe6] px-5 py-20 text-[#111111] tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[140px]">
      <div className="mx-auto max-w-[1600px]">
        {/* TITLE */}
        <div className="mx-auto max-w-[1000px] text-center">
          <p className="mb-4 text-[12px] font-light uppercase tracking-[0.28em] text-[#b48a45] tablet:mb-5 tablet:text-[14px] tablet:tracking-[0.36em] desktop:text-[16px] desktop:tracking-[0.42em]">
            {!props.menusPage ? "Carte et menus" : "Menus"}
          </p>

          <h2 className="text-balance yeseva-one-regular text-[34px] uppercase leading-[1.06] tracking-[-0.04em] tablet:text-[44px] desktop:text-[54px] desktop:leading-[1.04]">
            {getMenuTitle(featuredMenu)}
          </h2>

          {featuredMenu?.description ? (
            <p className="yeseva-one-regular mx-auto mt-5 max-w-[760px] text-[19px] text-black whitespace-pre-line tablet:text-[24px] desktop:text-[26px]">
              {featuredMenu.description}
            </p>
          ) : null}
        </div>

        {/* CONTENT */}
        <div className="mt-14 grid grid-cols-1 gap-14 tablet:mt-16 tablet:gap-16 desktop:mt-[70px] min-[1180px]:grid-cols-[420px_minmax(0,1fr)] min-[1180px]:items-center min-[1180px]:gap-[60px] desktop:gap-[80px] ultraWild:grid-cols-[470px_minmax(0,1fr)]">
          {/* LEFT IMAGE */}
          <div className="relative mx-auto w-full max-w-[360px] tablet:max-w-[430px] desktop:max-w-[470px]">
            <div className="relative overflow-hidden rounded-t-[180px] border border-[#b48a45] p-3 tablet:rounded-t-[220px] tablet:p-4 desktop:rounded-t-[240px]">
              <div className="relative h-[420px] overflow-hidden rounded-t-[180px] tablet:h-[500px] tablet:rounded-t-[220px] desktop:h-[570px] desktop:rounded-t-[240px]">
                <Image
                  src="/img/menu-inspired/1.png"
                  alt="Cuisine et dressage à l'assiette"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* BADGE */}
            <div className="absolute bottom-[-20px] left-1/2 z-10 flex h-[76px] w-[76px] -translate-x-1/2 items-center justify-center rounded-full border border-[#d4bf96] bg-[#b48a45] text-center text-[9px] uppercase tracking-[0.14em] text-white tablet:bottom-[-22px] tablet:h-[88px] tablet:w-[88px] tablet:text-[10px] tablet:tracking-[0.18em]">
              <span className="-mt-1 tablet:-mt-2">
                À
                <br />
                l’Assiette
              </span>
            </div>
          </div>

          {/* RIGHT MENUS */}
          <div className="grid gap-7 tablet:gap-8">
            {featuredMenuBlocks.map((menu) => (
              <MenuCard
                key={menu.id}
                title={menu.title}
                price={menu.price}
                items={menu.lines}
              />
            ))}

            {!props.menusPage && (
              <div className="flex justify-center min-[1180px]:justify-start">
                <button
                  type="button"
                  className="flex h-[52px] w-full max-w-[260px] items-center justify-center bg-[#bb924b] text-[12px] font-medium uppercase tracking-[0.22em] text-white transition hover:opacity-90 tablet:text-[14px] tablet:tracking-[0.28em] desktop:w-[220px]"
                  onClick={() => router.push("/menus")}
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
