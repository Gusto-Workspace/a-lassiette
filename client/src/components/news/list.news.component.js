import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { formatNewsDate, getVisibleNews } from "../../_assets/utils/news.utils";

const modalRichTextClass =
  "mt-6 text-[16px] font-light leading-[1.85] text-black/60 tablet:text-[18px] [&_p]:mt-4 [&_p:first-child]:mt-0 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-2 [&_strong]:font-medium [&_em]:italic";

function getNewsExcerpt(value, maxLength = 145) {
  const plainText = String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return "";
  }

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trim()}…`;
}

function NewsImage({ item, className = "" }) {
  if (item?.image) {
    return (
      <img
        src={item.image}
        alt={item?.title || "Actualité"}
        className={`h-full w-full object-cover ${className}`.trim()}
      />
    );
  }

  return (
    <div
      className={`flex h-full min-h-[240px] w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(180,138,69,0.22),_transparent_55%),linear-gradient(135deg,#022401_0%,#163d10_100%)] text-center text-white/65 ${className}`.trim()}
    >
      <div className="px-8">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4bf96]">
          Actualités
        </p>
        <p className="yeseva-one-regular mt-3 text-[30px] uppercase leading-none">
          À l’Assiette
        </p>
      </div>
    </div>
  );
}

function LoadingSection() {
  return (
    <div className="mt-14 grid grid-cols-1 gap-8 desktop:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`news-skeleton-${index}`}
          className="overflow-hidden rounded-[30px] border border-[#c7b79a]/20 bg-white/60"
        >
          <div className="h-[260px] animate-pulse bg-[#e6dfd3]" />
          <div className="px-5 py-6 tablet:px-7 tablet:py-7">
            <div className="flex items-start justify-between gap-4">
              <div className="h-10 w-[58%] animate-pulse rounded bg-black/8" />
              <div className="mt-1 h-4 w-24 animate-pulse rounded bg-[#d6c8aa]" />
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-black/7" />
              <div className="h-4 w-full animate-pulse rounded bg-black/7" />
              <div className="h-4 w-[72%] animate-pulse rounded bg-black/7" />
            </div>
            <div className="mt-6 h-px w-full bg-black/8" />
            <div className="mt-5 h-4 w-28 animate-pulse rounded bg-[#d6c8aa]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NewsCard({ item, onOpen }) {
  const dateLabel = formatNewsDate(item?.published_at);
  const excerpt = getNewsExcerpt(item?.description);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[30px] border border-[#c7b79a]/35 bg-[#f6f1e8] shadow-[0_20px_55px_rgba(45,31,7,0.07)] transition-shadow duration-300 hover:shadow-[0_24px_65px_rgba(45,31,7,0.11)]">
      <div className="relative h-[260px] overflow-hidden">
        <NewsImage item={item} />
      </div>

      <div className="flex flex-1 flex-col justify-between px-5 py-6 tablet:px-7 tablet:py-7">
        <div>
          <div className="flex items-start justify-between gap-5">
            <h3 className="yeseva-one-regular text-[28px] leading-[1.08] text-[#111111] tablet:text-[32px]">
              {item?.title}
            </h3>

            {dateLabel ? (
              <span className="mt-1 shrink-0 text-right text-[12px] font-light uppercase tracking-[0.22em] text-[#b48a45] tablet:text-[13px]">
                {dateLabel}
              </span>
            ) : null}
          </div>

          {excerpt ? (
            <p className="mt-5 text-[16px] font-light leading-[1.8] text-black/58 tablet:text-[17px]">
              {excerpt}
            </p>
          ) : null}
        </div>

        <div className="mt-7">
          <div className="h-px w-full bg-[#c7b79a]/35" />

          <button
            type="button"
            onClick={() => onOpen(item)}
            className="mt-5 text-[16px] font-medium uppercase tracking-[0.18em] text-[#b48a45] transition-opacity hover:opacity-65 tablet:text-[17px]"
          >
            En savoir +
          </button>
        </div>
      </div>
    </article>
  );
}

function NewsModal({ item, onClose }) {
  const dateLabel = formatNewsDate(item?.published_at);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 px-4 py-8"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-[#c7b79a]/35 bg-[#f6f1e8] shadow-[0_28px_90px_rgba(0,0,0,0.28)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#c7b79a]/25 px-5 py-4 tablet:px-7 tablet:py-5">
          <div>
            <h2 className="yeseva-one-regular text-[28px] leading-[1.04] text-[#111111] tablet:text-[36px]">
              {item?.title}
            </h2>

            {dateLabel ? (
              <p className="mt-2 text-[12px] font-light uppercase tracking-[0.22em] text-[#b48a45] tablet:text-[13px]">
                {dateLabel}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c7b79a]/35 text-[#111111] transition hover:bg-white/60"
            aria-label="Fermer l’actualité"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 tablet:px-7 tablet:py-7">
          <div className="overflow-hidden rounded-[24px]">
            <NewsImage item={item} className="max-h-[420px]" />
          </div>

          {item?.description ? (
            <div
              className={modalRichTextClass}
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ListNewsComponent({
  restaurantData,
  dataLoading = false,
}) {
  const [selectedNews, setSelectedNews] = useState(null);
  const visibleNews = getVisibleNews(restaurantData);

  useEffect(() => {
    if (!selectedNews) {
      document.body.style.overflow = "";
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedNews]);

  return (
    <>
      <section className="w-full bg-[#eeebe6] px-5 py-20 text-[#111111] tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px]">
        <div className="mx-auto max-w-[1600px]">
          <div className="mx-auto max-w-[860px] text-center">
            <p className="mb-4 text-[12px] font-light uppercase tracking-[0.28em] text-[#b48a45] tablet:mb-5 tablet:text-[14px] tablet:tracking-[0.42em] desktop:text-[16px]">
              Actualités
            </p>

            <h2 className="text-balance yeseva-one-regular text-[30px] uppercase leading-[1.06] tracking-[-0.04em] tablet:text-[44px] desktop:text-[56px]">
              Les nouveautés du restaurant
            </h2>

            <p className="mx-auto mt-5 max-w-[720px] text-[16px] font-light leading-[1.8] text-black/58 tablet:text-[18px] tablet:leading-[1.85]">
              Temps forts, événements, suggestions et nouveautés de saison:
              retrouvez ici tout ce qui fait vivre À l’Assiette au fil des
              semaines.
            </p>
          </div>

          {dataLoading && !restaurantData ? (
            <LoadingSection />
          ) : !visibleNews.length ? (
            <div className="mx-auto mt-14 max-w-[900px] rounded-[32px] border border-[#c7b79a]/30 bg-white/70 px-6 py-12 text-center shadow-[0_24px_60px_rgba(45,31,7,0.05)] tablet:px-10 tablet:py-16">
              <p className="text-[12px] uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[14px]">
                Actualités
              </p>
              <h3 className="yeseva-one-regular mt-5 text-[28px] uppercase leading-[1.08] text-[#111111] tablet:text-[36px]">
                Aucune actualité pour le moment
              </h3>
              <p className="mx-auto mt-5 max-w-[560px] text-[16px] font-light leading-[1.8] text-black/55 tablet:text-[18px]">
                Revenez bientôt pour découvrir les prochains temps forts du
                restaurant.
              </p>
            </div>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-8 desktop:grid-cols-2 desktop:gap-10">
              {visibleNews.map((item, index) => {
                const isLastOddCard =
                  visibleNews.length % 2 === 1 &&
                  index === visibleNews.length - 1;

                return (
                  <div
                    key={item?._id || `news-${index}`}
                    className={
                      isLastOddCard
                        ? "desktop:col-span-2 desktop:mx-auto desktop:max-w-[760px] desktop:w-full"
                        : ""
                    }
                  >
                    <NewsCard item={item} onOpen={setSelectedNews} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {selectedNews ? (
        <NewsModal item={selectedNews} onClose={() => setSelectedNews(null)} />
      ) : null}
    </>
  );
}
