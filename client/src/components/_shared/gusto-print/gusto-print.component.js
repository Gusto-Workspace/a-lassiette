import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const GUSTO_PRINT_PAGE_STYLE = {
  "--gusto-print-page-width": "210mm",
  "--gusto-print-page-height": "297mm",
  "--gusto-print-margin-block": "10mm",
  "--gusto-print-margin-inline": "12mm",
};

export function useGustoPrintMode() {
  const router = useRouter();
  const [locationPrintMode, setLocationPrintMode] = useState({
    printMode: false,
    autoPrint: false,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setLocationPrintMode({
      printMode: searchParams.get("gustoPrint") === "1",
      autoPrint: searchParams.get("autoprint") === "1",
    });
  }, []);

  return {
    printMode:
      (router.isReady && router.query.gustoPrint === "1") ||
      locationPrintMode.printMode,
    autoPrint:
      (router.isReady && router.query.autoprint === "1") ||
      locationPrintMode.autoPrint,
  };
}

export function hasPrintableMenuContent(restaurant) {
  const hasDishes = (restaurant?.dish_categories || []).some(
    (category) =>
      category?.visible &&
      ((category?.dishes || []).some((dish) => dish?.showOnWebsite) ||
        (category?.subCategories || []).some(
          (subCategory) =>
            subCategory?.visible !== false &&
            (subCategory?.dishes || []).some((dish) => dish?.showOnWebsite),
        )),
  );
  const hasMenus = (restaurant?.menus || []).some(
    (menu) => menu?.visible !== false,
  );

  return hasDishes || hasMenus;
}

export default function GustoPrintComponent({
  autoPrint,
  restaurant,
  dataLoading,
  dataError,
  children,
}) {
  const hasTriggeredPrint = useRef(false);
  const isReady = !dataLoading && Boolean(restaurant) && !dataError;
  const hasContent = isReady && hasPrintableMenuContent(restaurant);

  useEffect(() => {
    if (!autoPrint || !isReady || !hasContent || hasTriggeredPrint.current) {
      return undefined;
    }

    hasTriggeredPrint.current = true;
    let cancelled = false;

    const launchPrint = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (cancelled) return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) window.print();
        });
      });
    };

    launchPrint();
    return () => {
      cancelled = true;
    };
  }, [autoPrint, hasContent, isReady]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main
        className="gusto-print-mode"
        style={GUSTO_PRINT_PAGE_STYLE}
        data-gusto-print-ready={isReady && hasContent ? "true" : "false"}
      >
        <div className="gusto-print-toolbar" data-gusto-no-print>
          <span>{restaurant?.name || "Carte & menus"}</span>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!hasContent}
          >
            Imprimer
          </button>
        </div>

        {dataLoading ? (
          <p className="gusto-print-status">Chargement de la carte…</p>
        ) : dataError ? (
          <p className="gusto-print-status">Impossible de charger la carte.</p>
        ) : !hasContent ? (
          <div className="gusto-print-status">
            <p>La carte ne contient actuellement aucun plat ou menu publié.</p>
          </div>
        ) : (
          children
        )}
      </main>
    </>
  );
}
