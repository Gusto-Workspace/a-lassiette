import Link from "next/link";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CalendarDays,
  Clock3,
  CreditCard,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  TriangleAlert,
  Users,
} from "lucide-react";

import { GlobalContext } from "@/contexts/global.context";
import { buildContactInfos } from "@/_assets/utils/contact.utils";
import BannerComponent from "@/components/_shared/banner/banner.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import NavComponent from "@/components/_shared/nav/nav.component";
import { parseReservationDateValue } from "@/utils/reservations";

const brandName = "À l’Assiette";

export default function ManageReservationsComponent({
  reservationId,
  apiBaseUrl,
}) {
  const { restaurantContext } = useContext(GlobalContext);
  const restaurant = restaurantContext?.restaurantData;
  const restaurantLoading = restaurantContext?.dataLoading;
  const heroRef = useRef(null);
  const [showScrolledNav, setShowScrolledNav] = useState(false);

  const [reservation, setReservation] = useState(null);
  const [management, setManagement] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const contactInfos = useMemo(
    () => buildContactInfos(restaurant),
    [restaurant],
  );
  const phoneInfo = contactInfos.find((item) => item.key === "phone");
  const emailInfo = contactInfos.find((item) => item.key === "email");
  const contactHref = phoneInfo?.href || emailInfo?.href || "/contact";

  const reservationRestaurantId = useMemo(
    () =>
      String(
        reservation?.restaurant_id?._id || reservation?.restaurant_id || "",
      ),
    [reservation],
  );

  const restaurantMismatch = useMemo(() => {
    if (!reservationRestaurantId || !restaurant?._id || restaurantLoading) {
      return false;
    }

    return String(restaurant._id) !== reservationRestaurantId;
  }, [reservationRestaurantId, restaurant?._id, restaurantLoading]);

  const reservationStatusLabel = getReservationStatusLabel(reservation?.status);
  const isAwaitingBankHold =
    String(reservation?.status || "") === "AwaitingBankHold" &&
    management?.reasonCode !== "BANK_HOLD_EXPIRED";
  const isCanceled = String(reservation?.status || "") === "Canceled";
  const canCancel = management?.canCancel === true && !restaurantMismatch;

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrolledNav(entry.intersectionRatio <= 0.1);
      },
      {
        threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    observer.observe(heroEl);

    return () => observer.disconnect();
  }, []);

  const fetchReservation = useCallback(async () => {
    if (!reservationId || !apiBaseUrl) {
      setLoadError("Ce lien de réservation est invalide.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setLoadError("");

      const response = await fetch(
        `${apiBaseUrl}/reservations/${reservationId}`,
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getReservationApiErrorMessage({
            payload: data,
            status: response.status,
            fallbackMessage: "Impossible de retrouver cette réservation.",
          }),
        );
      }

      if (!data?.reservation) {
        throw new Error("Impossible de retrouver cette réservation.");
      }

      setReservation(data.reservation);
      setManagement(data.management || null);
      setShowCancelConfirm(false);
    } catch (fetchError) {
      setLoadError(
        fetchError?.message || "Impossible de retrouver cette réservation.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, reservationId]);

  useEffect(() => {
    fetchReservation();
  }, [fetchReservation]);

  async function handleCancelReservation() {
    if (!reservation?._id || !apiBaseUrl) return;

    try {
      setIsCanceling(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${apiBaseUrl}/reservations/${reservation._id}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getReservationApiErrorMessage({
            payload: data,
            status: response.status,
            fallbackMessage: "Impossible d’annuler la réservation.",
          }),
        );
      }

      setReservation(data.reservation || null);
      setManagement(data.management || null);
      setShowCancelConfirm(false);
      setSuccessMessage(
        data?.message || "Votre réservation a bien été annulée.",
      );
    } catch (cancelError) {
      setError(cancelError?.message || "Impossible d’annuler la réservation.");
    } finally {
      setIsCanceling(false);
    }
  }

  return (
    <div className="relative">
      <NavComponent
        isVisible={!showScrolledNav}
        scrolled={false}
        logoSrc="/img/logo.png"
      />

      <NavComponent
        isVisible={showScrolledNav}
        scrolled
        logoSrc="/img/logo.png"
      />

      <main>
        <div ref={heroRef}>
          <BannerComponent
            title="Annuler ma réservation"
            imgUrl="reservations/2.jpg"
            opacity={true}
          />
        </div>

        <section className="bg-[#eeebe6] px-5 py-16 text-[#111111] tablet:px-8 tablet:py-20 desktop:px-[90px] desktop:py-[110px]">
          <div className="mx-auto max-w-[1600px]">
            <div className="mx-auto max-w-[780px] text-center">
              <p className="text-[12px] uppercase tracking-[0.32em] text-[#b48a45] tablet:text-[14px] tablet:tracking-[0.38em]">
                Gestion en ligne
              </p>
              <h1 className="yeseva-one-regular mt-5 text-[34px] uppercase leading-[1.04] tracking-[-0.04em] tablet:text-[46px] desktop:text-[56px]">
                Consulter et annuler votre réservation
              </h1>
              <p className="mt-6 text-[16px] font-light leading-[1.8] text-black/68 tablet:text-[18px]">
                Cette page permet uniquement d’annuler votre réservation. Pour
                toute modification concernant votre venue, merci de contacter
                directement le restaurant.
              </p>
            </div>

            {isLoading || (reservation && restaurantLoading) ? (
              <StatePanel
                title="Chargement en cours"
                description="Nous retrouvons votre réservation pour préparer son annulation si nécessaire."
                loading
              />
            ) : null}

            {!isLoading && loadError ? (
              <StatePanel
                eyebrow="Lien invalide"
                title="Réservation introuvable"
                description={loadError}
                actions={[
                  { href: "/reservations", label: "Réserver une table" },
                  {
                    href: contactHref,
                    label: "Contacter le restaurant",
                    variant: "secondary",
                  },
                ]}
              />
            ) : null}

            {!isLoading && !loadError && restaurantMismatch ? (
              <StatePanel
                eyebrow="Lien invalide"
                title="Ce lien ne correspond pas à ce restaurant"
                description="La réservation associée à ce lien n’est pas rattachée au site À l’Assiette."
                actions={[
                  {
                    href: "/reservations",
                    label: "Retour aux réservations",
                  },
                  {
                    href: contactHref,
                    label: "Contacter le restaurant",
                    variant: "secondary",
                  },
                ]}
              />
            ) : null}

            {!isLoading && !loadError && !restaurantMismatch && !restaurant ? (
              <StatePanel
                eyebrow="Indisponible"
                title="Le restaurant n’a pas pu être chargé"
                description="Nous n’avons pas réussi à charger les informations du restaurant pour vérifier ce lien."
                actions={[
                  {
                    href: contactHref,
                    label: "Contacter le restaurant",
                  },
                  {
                    href: "/reservations",
                    label: "Retour aux réservations",
                    variant: "secondary",
                  },
                ]}
              />
            ) : null}

            {!isLoading && !loadError && !restaurantMismatch && restaurant ? (
              <div className="mt-14 grid gap-6 min-[1050px]:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] desktop:gap-8">
                <div className="border border-[#cdb78c]/55 bg-white p-7 tablet:p-8 desktop:p-10">
                 

                  <div className="">
                    {renderPrimaryContent({
                      reservation,
                      management,
                      isAwaitingBankHold,
                      isCanceled,
                      canCancel,
                      error,
                      successMessage,
                      isCanceling,
                      showCancelConfirm,
                      setShowCancelConfirm,
                      handleCancelReservation,
                      contactHref,
                      reservationId,
                      restaurantName: restaurant?.name || brandName,
                    })}
                  </div>
                </div>

                <aside className="border border-[#cdb78c]/55 bg-white p-7 tablet:p-8 desktop:p-10">
                  <p className="text-[12px] uppercase tracking-[0.32em] text-[#b48a45] tablet:text-[14px] tablet:tracking-[0.38em]">
                    Récapitulatif
                  </p>
                  <h2 className="yeseva-one-regular mt-5 text-[34px] uppercase leading-[1.04] tracking-[-0.04em] tablet:text-[42px]">
                    Votre venue à {restaurant?.name || brandName}
                  </h2>

                  <div className="mt-8 space-y-5">
                    <SummaryRow
                      icon={MessageSquare}
                      label="Nom"
                      value={getCustomerFullName(reservation)}
                    />
                    <SummaryRow
                      icon={CalendarDays}
                      label="Date"
                      value={formatReservationDateLabel(reservation?.reservationDate)}
                    />
                    <SummaryRow
                      icon={Clock3}
                      label="Horaire"
                      value={formatTimeLabel(reservation?.reservationTime)}
                    />
                    <SummaryRow
                      icon={Users}
                      label="Personnes"
                      value={formatGuestsLabel(reservation?.numberOfGuests)}
                    />
                    <SummaryRow
                      icon={Phone}
                      label="Téléphone"
                      value={reservation?.customerPhone || "Non renseigné"}
                    />
                    <SummaryRow
                      icon={Mail}
                      label="E-mail"
                      value={reservation?.customerEmail || "Non renseigné"}
                    />
                    <SummaryRow
                      icon={TriangleAlert}
                      label="Statut"
                      value={reservationStatusLabel}
                    />
                    {reservation?.commentary ? (
                      <SummaryRow
                        icon={MessageSquare}
                        label="Commentaire"
                        value={reservation.commentary}
                      />
                    ) : null}
                  </div>

                  <div className="mt-8 border-l border-[#b48a45] pl-5">
                    <p className="text-[12px] uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[13px] tablet:tracking-[0.3em]">
                      Pour toute modification
                    </p>
                    <p className="mt-3 text-[15px] font-light leading-[1.8] text-black/68 tablet:text-[16px]">
                      Merci de contacter directement le restaurant.
                    </p>

                    <div className="mt-5 flex flex-col gap-3">
                      {phoneInfo?.value && phoneInfo.value !== "-" ? (
                        <ContactLink
                          href={phoneInfo.href}
                          icon={Phone}
                          label="Téléphone"
                          value={phoneInfo.value}
                        />
                      ) : null}
                      {emailInfo?.value && emailInfo.value !== "-" ? (
                        <ContactLink
                          href={emailInfo.href}
                          icon={Mail}
                          label="E-mail"
                          value={emailInfo.value}
                        />
                      ) : null}
                    </div>
                  </div>
                </aside>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <FooterComponent />
    </div>
  );
}

function renderPrimaryContent({
  reservation,
  management,
  isAwaitingBankHold,
  isCanceled,
  canCancel,
  error,
  successMessage,
  isCanceling,
  showCancelConfirm,
  setShowCancelConfirm,
  handleCancelReservation,
  contactHref,
  reservationId,
  restaurantName,
}) {
  if (isAwaitingBankHold) {
    return (
      <div>
        <ContentHeader
          eyebrow="Validation requise"
          title="La carte bancaire doit encore être validée"
          description="Finalisez l’empreinte bancaire pour confirmer définitivement votre réservation. Pour toute modification, contactez directement le restaurant."
        />

        <InfoBox icon={CreditCard}>
          Tant que cette étape n’est pas finalisée, votre réservation ne peut
          pas être considérée comme confirmée.
        </InfoBox>

        <div className="mt-8 flex flex-col gap-4 tablet:flex-row">
          <ButtonLink href={`/reservations/${reservationId}/bank-hold`}>
            Finaliser la validation
          </ButtonLink>
          <ButtonLink href={contactHref} variant="secondary">
            Contacter le restaurant
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (isCanceled) {
    return (
      <div>
        <ContentHeader
          eyebrow="Réservation annulée"
          title="Votre table a bien été libérée"
          description={`Cette réservation chez ${restaurantName} est désormais annulée. Vous pouvez réserver un nouveau créneau à tout moment.`}
        />

        {successMessage ? (
          <InlineAlert variant="success">{successMessage}</InlineAlert>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 tablet:flex-row">
          <ButtonLink href="/reservations">Réserver à nouveau</ButtonLink>
          <ButtonLink href={contactHref} variant="secondary">
            Contacter le restaurant
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ContentHeader
        eyebrow="Annulation"
        title="Annuler cette réservation"
        description={`Cette page permet uniquement d’annuler votre réservation chez ${restaurantName}. Pour tout changement de date, d’horaire ou de nombre de couverts, merci de contacter directement le restaurant.`}
      />

      {error ? <InlineAlert variant="error">{error}</InlineAlert> : null}
      {successMessage ? (
        <InlineAlert variant="success">{successMessage}</InlineAlert>
      ) : null}

      {canCancel ? (
        <>
          <InfoBox icon={TriangleAlert}>
            En confirmant l’annulation, votre réservation sera annulée
            immédiatement et le créneau pourra redevenir disponible.
          </InfoBox>

          <div className="mt-8 flex flex-col gap-4 tablet:flex-row">
            <button
              type="button"
              onClick={() => setShowCancelConfirm((prev) => !prev)}
              className={primaryButtonClass}
            >
              Annuler la réservation
            </button>
            <ButtonLink href={contactHref} variant="secondary">
              Contacter le restaurant
            </ButtonLink>
          </div>
        </>
      ) : (
        <InlineAlert variant="info">
          {management?.reasonMessage ||
            "Cette réservation ne peut plus être annulée en ligne."}
        </InlineAlert>
      )}

      {showCancelConfirm ? (
        <div className="mt-8 border border-[#c89b8a]/50 bg-[#fff4ef] p-5">
          <p className="text-[12px] uppercase tracking-[0.24em] text-[#b05e4d] tablet:text-[13px]">
            Confirmation requise
          </p>
          <p className="mt-3 text-[15px] font-light leading-[1.8] text-black/72 tablet:text-[16px]">
            Confirmez-vous l’annulation de cette réservation ? Si vous
            souhaitez simplement modifier votre venue, contactez plutôt le
            restaurant.
          </p>

          <div className="mt-5 flex flex-col gap-3 tablet:flex-row">
            <button
              type="button"
              onClick={handleCancelReservation}
              disabled={isCanceling}
              className={`${primaryButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {isCanceling ? "Annulation..." : "Oui, annuler"}
            </button>
            <button
              type="button"
              onClick={() => setShowCancelConfirm(false)}
              className={secondaryButtonClass}
            >
              Garder ma réservation
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-10 grid gap-4 tablet:grid-cols-3">
        <KeyMetric
          label="Date"
          value={formatReservationDateLabel(reservation?.reservationDate)}
        />
        <KeyMetric
          label="Horaire"
          value={formatTimeLabel(reservation?.reservationTime)}
        />
        <KeyMetric
          label="Convives"
          value={formatGuestsLabel(reservation?.numberOfGuests)}
        />
      </div>
    </div>
  );
}

function StatePanel({
  eyebrow = "Réservation",
  title,
  description,
  actions = [],
  loading = false,
}) {
  return (
    <div className="mx-auto mt-14 max-w-[920px] border border-[#cdb78c]/55 bg-white p-7 text-center tablet:p-10">
      <p className="text-[12px] uppercase tracking-[0.32em] text-[#b48a45] tablet:text-[14px] tablet:tracking-[0.38em]">
        {eyebrow}
      </p>
      <h2 className="yeseva-one-regular mt-5 text-[34px] uppercase leading-[1.04] tracking-[-0.04em] tablet:text-[44px]">
        {title}
      </h2>
      <p className="mx-auto mt-6 max-w-[640px] text-[16px] font-light leading-[1.8] text-black/68 tablet:text-[18px]">
        {description}
      </p>

      {loading ? (
        <div className="mt-8 inline-flex items-center gap-3 border border-[#cdb78c]/55 bg-[#f8f3ea] px-5 py-3 text-[15px] text-black/68">
          <Loader2 size={18} className="animate-spin" />
          Chargement...
        </div>
      ) : null}

      {actions.length > 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 tablet:flex-row">
          {actions.map((action) => (
            <ButtonLink
              key={`${action.href}-${action.label}`}
              href={action.href}
              variant={action.variant}
            >
              {action.label}
            </ButtonLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ContentHeader({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-[12px] uppercase tracking-[0.32em] text-[#b48a45] tablet:text-[14px] tablet:tracking-[0.38em]">
        {eyebrow}
      </p>
      <h2 className="yeseva-one-regular mt-5 text-[34px] uppercase leading-[1.04] tracking-[-0.04em] tablet:text-[42px]">
        {title}
      </h2>
      <p className="mt-6 max-w-[700px] text-[16px] font-light leading-[1.8] text-black/68 tablet:text-[18px]">
        {description}
      </p>
    </div>
  );
}

function InfoBox({ icon: Icon, children }) {
  return (
    <div className="mt-8 border-l border-[#b48a45] bg-[#f8f3ea] px-5 py-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#cdb78c]/55 bg-white text-[#b48a45]">
          <Icon size={18} strokeWidth={1.8} />
        </div>
        <p className="text-[15px] font-light leading-[1.8] text-black/72 tablet:text-[16px]">
          {children}
        </p>
      </div>
    </div>
  );
}

function InlineAlert({ children, variant = "info" }) {
  const paletteByVariant = {
    info: "border-[#cdb78c]/55 bg-[#f8f3ea] text-black/72",
    success: "border-[#8fb08f]/55 bg-[#edf6ed] text-[#355235]",
    error: "border-[#c89b8a]/50 bg-[#fff4ef] text-[#8a4336]",
  };

  return (
    <div
      className={`mt-8 border px-5 py-4 text-[15px] font-light leading-[1.8] ${paletteByVariant[variant] || paletteByVariant.info}`}
    >
      {children}
    </div>
  );
}

function KeyMetric({ label, value }) {
  return (
    <div className="border border-[#cdb78c]/55 bg-[#f8f3ea] px-5 py-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[12px]">
        {label}
      </p>
      <p className="mt-3 text-[16px] font-light leading-[1.7] text-black/76 tablet:text-[18px]">
        {value}
      </p>
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 border-b border-[#dbcaa6]/45 pb-5 last:border-b-0 last:pb-0">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#cdb78c]/55 bg-[#f8f3ea] text-[#b48a45]">
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[12px]">
          {label}
        </p>
        <p className="mt-2 text-[15px] font-light leading-[1.8] text-black/76 tablet:text-[16px]">
          {value}
        </p>
      </div>
    </div>
  );
}

function ContactLink({ href, icon: Icon, label, value }) {
  return (
    <a
      href={href}
      className="flex items-start gap-4 border border-[#dbcaa6]/45 bg-white px-4 py-4 transition hover:border-[#b48a45]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#cdb78c]/55 bg-[#f8f3ea] text-[#b48a45]">
        <Icon size={17} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[12px]">
          {label}
        </p>
        <p className="mt-1 text-[15px] font-light leading-[1.7] text-black/76">
          {value}
        </p>
      </div>
    </a>
  );
}

function StatusBadge({ status }) {
  const label = getReservationStatusLabel(status);
  const paletteByStatus = {
    Confirmed: "border-[#8fb08f]/55 bg-[#edf6ed] text-[#355235]",
    Pending: "border-[#cdb78c]/55 bg-[#f8f3ea] text-[#7e6842]",
    AwaitingBankHold: "border-[#cdb78c]/55 bg-[#f8f3ea] text-[#7e6842]",
    Canceled: "border-[#c89b8a]/50 bg-[#fff4ef] text-[#8a4336]",
    Rejected: "border-[#c89b8a]/50 bg-[#fff4ef] text-[#8a4336]",
    Finished: "border-[#d8d0c5] bg-[#f6f4ef] text-black/55",
    Active: "border-[#d8d0c5] bg-[#f6f4ef] text-black/55",
    Late: "border-[#d8d0c5] bg-[#f6f4ef] text-black/55",
    NoShow: "border-[#d8d0c5] bg-[#f6f4ef] text-black/55",
  };

  return (
    <span
      className={`border px-4 py-2 text-[11px] uppercase tracking-[0.26em] tablet:text-[12px] ${paletteByStatus[status] || "border-[#cdb78c]/55 bg-[#f8f3ea] text-[#7e6842]"}`}
    >
      {label}
    </span>
  );
}

function ButtonLink({ href, children, variant = "primary" }) {
  const className =
    variant === "secondary" ? secondaryButtonClass : primaryButtonClass;
  const isExternal = /^(https?:|mailto:|tel:)/.test(String(href || ""));

  if (!href) return null;

  if (isExternal) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function getCustomerFullName(reservation) {
  return (
    String(reservation?.customerName || "").trim() ||
    `${String(reservation?.customerFirstName || "").trim()} ${String(reservation?.customerLastName || "").trim()}`.trim() ||
    "Client"
  );
}

function formatReservationDateLabel(value) {
  const parsedDate = parseReservationDateValue(value);
  if (!parsedDate) {
    return value ? String(value) : "Date à confirmer";
  }

  return format(parsedDate, "EEEE d MMMM yyyy", { locale: fr });
}

function formatTimeLabel(value) {
  const normalized = String(value || "").trim();
  return normalized ? normalized.slice(0, 5) : "Horaire à confirmer";
}

function formatGuestsLabel(value) {
  const guests = Number(value || 0);
  if (!guests) return "Nombre de convives à confirmer";
  return `${guests} ${guests > 1 ? "convives" : "convive"}`;
}

function getReservationStatusLabel(status) {
  const labels = {
    Pending: "En attente",
    Confirmed: "Confirmée",
    AwaitingBankHold: "Validation carte requise",
    Canceled: "Annulée",
    Rejected: "Refusée",
    Finished: "Terminée",
    Active: "En cours",
    Late: "En retard",
    NoShow: "Non honorée",
  };

  return labels[String(status || "").trim()] || "Réservation";
}

function getReservationApiErrorMessage({
  payload,
  status,
  fallbackMessage,
}) {
  const code = String(payload?.code || "").trim();
  const message = String(payload?.message || "").trim();
  const normalizedMessage = message.toLowerCase();

  if (status === 404) {
    return "Cette réservation est introuvable ou ce lien n’est plus valide.";
  }

  if (code === "NOT_MODIFIABLE") {
    return message || "Cette réservation ne peut plus être annulée en ligne.";
  }

  if (normalizedMessage.includes("déjà annul")) {
    return "Cette réservation est déjà annulée.";
  }

  if (normalizedMessage.includes("ne peut plus être annul")) {
    return "Cette réservation ne peut plus être annulée en ligne.";
  }

  if (normalizedMessage.includes("introuvable")) {
    return "Cette réservation est introuvable ou ce lien n’est plus valide.";
  }

  return message || fallbackMessage;
}

const primaryButtonClass =
  "flex h-[54px] w-full items-center justify-center bg-[#bb924b] px-6 text-[12px] font-medium uppercase tracking-[0.24em] text-white transition hover:opacity-90 tablet:w-auto tablet:min-w-[220px] tablet:text-[13px] tablet:tracking-[0.28em]";

const secondaryButtonClass =
  "flex h-[54px] w-full items-center justify-center border border-[#cdb78c] bg-transparent px-6 text-[12px] font-medium uppercase tracking-[0.24em] text-[#111111] transition hover:border-[#b48a45] hover:bg-[#f8f3ea] tablet:w-auto tablet:min-w-[220px] tablet:text-[13px] tablet:tracking-[0.28em]";
