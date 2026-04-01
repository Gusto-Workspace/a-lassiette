import {
  buildMenuBlocks,
  getMenuPriceLabel,
  getMenuTitle,
  getSecondaryMenus,
  isMenuSeparatorLabel,
} from "../../_assets/utils/menu-display.utils";

function MenuLine({ value }) {
  return (
    <p
      className={
        isMenuSeparatorLabel(value)
          ? "text-[13px] uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[14px]"
          : "text-[16px] font-light leading-[1.7] text-black/60 tablet:text-[17px]"
      }
    >
      {value}
    </p>
  );
}

function MenuBlock({ block }) {
  return (
    <div className="rounded-[28px] border border-[#c7b79a]/30 bg-white/70 px-5 py-5 tablet:px-6 tablet:py-6">
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-start tablet:justify-center">
        <h4 className="yeseva-one-regular text-[22px] leading-[1.08] text-[#111111] tablet:text-[24px]">
          {block.title}
        </h4>

        {block.price ? (
          <span className="inline-flex w-fit items-center rounded-full border border-[#d4bf96] bg-[#b48a45]/10 px-4 py-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#b48a45]">
            {block.price}
          </span>
        ) : null}
      </div>

      {block.lines?.length ? (
        <div className="mt-5 space-y-2.5">
          {block.lines.map((line, index) => (
            <MenuLine key={`${block.id}-${index}`} value={line} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function OtherMenusComponent({ restaurantData }) {
  const menus = getSecondaryMenus(restaurantData);

  if (!menus.length) {
    return null;
  }

  return (
    <section className="w-full bg-white px-5 text-[#111111] tablet:px-8 desktop:px-[90px]">
      <div className="mx-auto max-w-[1600px] border-t border-[#c7b79a]/35 pt-14 tablet:pt-16 desktop:pt-20">
        <div className="mx-auto max-w-[920px] text-center">
          <h2 className="yeseva-one-regular text-balance text-[34px] uppercase leading-[1.06] tracking-[-0.04em] tablet:text-[44px] desktop:text-[52px]">
            Les autres menus
          </h2>

          <p className="mx-auto mt-5 max-w-[760px] text-[17px] font-light leading-[1.8] text-black/55 tablet:text-[18px]">
            Découvrez nos autres menus, tout ce qu'il faut pour vous satisfaire.
          </p>
        </div>

        <div className="mt-12 grid gap-8 tablet:mt-14 desktop:grid-cols-2 desktop:gap-10">
          {menus.map((menu, index) => {
            const menuBlocks = buildMenuBlocks(menu);
            const priceLabel = getMenuPriceLabel(menu);
            const isLastOddCard =
              menus.length % 2 === 1 && index === menus.length - 1;
            const blocksLayoutClass =
              menu?.type === "custom"
                ? "mt-7 flex flex-col gap-4 tablet:mt-8"
                : "mt-7 grid gap-5 tablet:mt-8 tablet:grid-cols-2";

            return (
              <article
                key={menu?._id || `menu-${index}`}
                className={`rounded-[34px] text-center border border-[#c7b79a]/35 bg-[#f6f1e8] px-5 py-6 shadow-[0_24px_70px_rgba(45,31,7,0.08)] tablet:px-8 tablet:py-8 ${
                  isLastOddCard
                    ? "desktop:col-span-2 desktop:mx-auto desktop:max-w-[760px] desktop:w-full"
                    : ""
                }`.trim()}
              >
                <div className="max-w-[620px] mx-auto">
                  <h3 className="yeseva-one-regular text-[28px] leading-[1.08] text-[#111111] tablet:text-[34px]">
                    {getMenuTitle(menu, index + 1)}
                  </h3>
                </div>

                {menu?.description ? (
                  <p className="mt-5 text-[16px] font-light leading-[1.8] text-black/60 whitespace-pre-line tablet:text-[17px]">
                    {menu.description}
                  </p>
                ) : null}

                {priceLabel ? (
                  <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-[#b48a45] tablet:text-[14px]">
                    {priceLabel}
                  </p>
                ) : null}

                {menuBlocks.length ? (
                  <div className={blocksLayoutClass}>
                    {menuBlocks.map((block) => (
                      <MenuBlock key={block.id} block={block} />
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
