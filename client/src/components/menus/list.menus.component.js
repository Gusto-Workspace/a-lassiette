import Image from "next/image";
import MenuInspiredHomeComponent from "../home/menu-inspired.home.component";
import BookingBarComponent from "../reservations/booking-bar.component";
import OtherMenusComponent from "./other-menus.menus.component";

function formatPrice(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return value || "";
  }

  return `${numericValue.toFixed(2).replace(".", ",")} €`;
}

function getVisibleMenuCategories(restaurantData) {
  const mapItems = (dishes = []) =>
    dishes
      .filter((dish) => dish?.showOnWebsite)
      .map((dish) => ({
        id: dish?._id || dish?.name,
        name: dish?.name || "",
        description: dish?.description || "",
        price: formatPrice(dish?.price),
      }));

  return (restaurantData?.dish_categories || [])
    .filter(
      (category) =>
        category?.visible &&
        ((category?.dishes || []).some((dish) => dish?.showOnWebsite) ||
          (category?.subCategories || []).some(
            (subCategory) =>
              subCategory?.visible !== false &&
              (subCategory?.dishes || []).some((dish) => dish?.showOnWebsite),
          )),
    )
    .map((category) => ({
      id: category?._id || category?.name,
      title: category?.name || "",
      description: category?.description || "",
      items: mapItems(category?.dishes),
      subCategories: (category?.subCategories || [])
        .filter(
          (subCategory) =>
            subCategory?.visible !== false &&
            (subCategory?.dishes || []).some((dish) => dish?.showOnWebsite),
        )
        .map((subCategory) => ({
          id: subCategory?._id || subCategory?.name,
          title: subCategory?.name || "",
          items: mapItems(subCategory?.dishes),
        })),
    }))
    .filter(
      (category) =>
        category.title &&
        (category.items.length > 0 || category.subCategories.length > 0),
    );
}

function MenuItem({ name, price, description }) {
  return (
    <div className="pb-5 last:pb-0" data-print-dish>
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

function CategoryBlock({ title, description, items, subCategories = [] }) {
  const firstItems = items.slice(0, 2);
  const remainingItems = items.slice(2);

  return (
    <div className="pb-4 tablet:pb-12">
      <div
        data-print-category-first-chunk
        data-print-category-without-dishes={items.length ? undefined : "true"}
      >
        <h3
          data-print-category-title
          className="w-full mb-12 text-center text-[28px] uppercase leading-[1.08] tracking-[-0.04em] text-[#111111] yeseva-one-regular tablet:text-[34px]"
        >
          {title}
        </h3>

        {description ? (
          <p className="-mt-7 mb-10 whitespace-pre-line text-center text-[16px] font-light leading-[1.75] text-black/55 tablet:-mt-8 tablet:mb-12 tablet:text-[17px] desktop:text-[18px]">
            {description}
          </p>
        ) : null}

        <div
          className="grid grid-cols-1 gap-x-16 gap-y-6 tablet:grid-cols-2"
          data-print-dish-list
        >
          {firstItems.map((item) => (
            <MenuItem
              key={item.id || `${title}-${item.name}`}
              name={item.name}
              price={item.price}
              description={item.description}
            />
          ))}
        </div>
      </div>

      {remainingItems.length ? (
        <div
          className="mt-6 grid grid-cols-1 gap-x-16 gap-y-6 tablet:grid-cols-2"
          data-print-dish-list
        >
          {remainingItems.map((item) => (
            <MenuItem
              key={item.id || `${title}-${item.name}`}
              name={item.name}
              price={item.price}
              description={item.description}
            />
          ))}
        </div>
      ) : null}

      {subCategories.map((subCategory) => {
        const firstItem = subCategory.items[0];
        const remainingSubCategoryItems = subCategory.items.slice(1);

        return (
          <section key={subCategory.id} className="mt-12 tablet:mt-14">
            <div data-print-subcategory-first-chunk>
              <h4
                data-print-subcategory-title
                className="mb-7 text-center text-[18px] font-medium uppercase tracking-[0.2em] text-[#b48a45] tablet:text-[20px]"
              >
                {subCategory.title}
              </h4>
              {firstItem ? (
                <div
                  className="grid grid-cols-1 gap-x-16 gap-y-6 tablet:grid-cols-2"
                  data-print-dish-list
                >
                  <MenuItem
                    name={firstItem.name}
                    price={firstItem.price}
                    description={firstItem.description}
                  />
                </div>
              ) : null}
            </div>
            {remainingSubCategoryItems.length ? (
              <div
                className="mt-6 grid grid-cols-1 gap-x-16 gap-y-6 tablet:grid-cols-2"
                data-print-dish-list
              >
                {remainingSubCategoryItems.map((item) => (
                  <MenuItem
                    key={item.id || `${subCategory.title}-${item.name}`}
                    name={item.name}
                    price={item.price}
                    description={item.description}
                  />
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

export default function FullMenuHomeComponent({
  restaurantData,
  printMode = false,
}) {
  const menuCategories = getVisibleMenuCategories(restaurantData);

  return (
    <section
      className="w-full bg-[#eeebe6] pt-[90px] text-[#111111]"
      data-print-page-surface
      data-print-menu-page
    >
      <div
        className=" text-[#111111] mx-auto max-w-[1600px] px-6 tablet:px-[50px] desktop:px-[90px]"
        data-print-card-content
      >
        {/* TITLE */}
        <div className="mx-auto max-w-[980px] text-center">
          <p
            className="mb-5 text-[13px] font-light uppercase tracking-[0.42em] text-[#b48a45] tablet:text-[16px]"
            data-print-card-eyebrow
          >
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
        <div className="mt-16 space-y-16" data-print-category-stack>
          {menuCategories.map((category) => (
            <CategoryBlock
              key={category.id || category.title}
              title={category.title}
              description={category.description}
              items={category.items}
              subCategories={category.subCategories}
            />
          ))}
        </div>

        {!printMode ? (
          <div className="mt-12 h-[140px] relative w-full">
            <Image
              src="/img/testimonials/badges.png"
              alt="badges"
              fill
              className="object-contain"
            />
          </div>
        ) : null}
      </div>

      {!printMode ? (
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
      ) : null}

      <div
        className="bg-white px-5 tablet:px-[90px] pb-[60px] desktop:pb-0 relative"
        data-print-menu-surface
      >
        <div
          className={`${printMode ? "py-12" : "-translate-y-[325px]"} flex flex-col gap-14 tablet:gap-16`}
        >
          <MenuInspiredHomeComponent
            menusPage={true}
            restaurantData={restaurantData}
            printMode={printMode}
          />
          <OtherMenusComponent restaurantData={restaurantData} />
        </div>

        {!printMode ? (
          <BookingBarComponent
            restaurant={restaurantData}
            theme="light"
            className="desktop:bottom-[130px]"
          />
        ) : null}
      </div>
    </section>
  );
}
