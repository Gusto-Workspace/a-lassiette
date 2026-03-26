import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Loader2, ChevronDown } from "lucide-react";
export default function FormReservationComponent({
  apiBaseUrl,
  restaurant,
  onBooked,
  dataLoading,
}) {
  const [reservationData, setReservationData] = useState({
    reservationDate: new Date(),
    reservationTime: "",
    numberOfGuests: "2",
    customerFirstName: "",
    customerLastName: "",
    customerEmail: "",
    customerPhone: "",
    commentary: "",
    table: "",
  });
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [reservationsList, setReservationsList] = useState([]);
  const [reservationsListLoading, setReservationsListLoading] =
    useState(false);
  const parameters =
    restaurant?.reservationsSettings || restaurant?.reservations?.parameters || {};
  const openingHours = restaurant?.opening_hours || [];
  const tablesCatalog = Array.isArray(parameters.tables) ? parameters.tables : [];
  const manage = !!parameters.manage_disponibilities;
  const [idempotencyKey] = useState(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `resa_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  });
  const PENDING_BANK_HOLD_STORAGE_KEY = "gm_pending_bank_hold";
  const [pendingBankHoldReservation, setPendingBankHoldReservation] =
    useState(null);
  const [showPendingBankHoldModal, setShowPendingBankHoldModal] =
    useState(false);
  const [isCancelingPendingBankHold, setIsCancelingPendingBankHold] =
    useState(false);
  const fetchReservationsList = useCallback(async () => {
    if (!apiBaseUrl || !restaurant?._id) {
      setReservationsList([]);
      return [];
    }
    try {
      setReservationsListLoading(true);
      const res = await fetch(
        `${apiBaseUrl}/public/restaurants/${restaurant._id}/reservations`,
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.message || "Impossible de charger les réservations.",
        );
      }
      const nextReservations = Array.isArray(data?.reservations)
        ? data.reservations
        : [];
      setReservationsList(nextReservations);
      return nextReservations;
    } catch (error) {
      console.error("[fetchReservationsList]", error);
      setReservationsList([]);
      return [];
    } finally {
      setReservationsListLoading(false);
    }
  }, [apiBaseUrl, restaurant?._id]);
  useEffect(() => {
    setReservationData((prev) => ({ ...prev, table: manage ? "auto" : "" }));
  }, [manage]);

  useEffect(() => {
    fetchReservationsList();
  }, [fetchReservationsList]);

  useEffect(() => {
    async function restorePendingBankHold() {
      try {
        const raw = localStorage.getItem(PENDING_BANK_HOLD_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!parsed?.reservationId || !parsed?.restaurantId) {
          localStorage.removeItem(PENDING_BANK_HOLD_STORAGE_KEY);
          return;
        }
        if (String(parsed.restaurantId) !== String(restaurant?._id)) {
          return;
        }
        const res = await fetch(
          `${apiBaseUrl}/reservations/${parsed.reservationId}`,
        );
        if (!res.ok) {
          localStorage.removeItem(PENDING_BANK_HOLD_STORAGE_KEY);
          return;
        }
        const data = await res.json();
        const reservation = data?.reservation;
        if (!reservation) {
          localStorage.removeItem(PENDING_BANK_HOLD_STORAGE_KEY);
          return;
        }
        const isAwaiting =
          String(reservation.status) === "AwaitingBankHold" &&
          Boolean(reservation?.bankHold?.enabled);
        const isExpired =
          reservation?.bankHold?.expiresAt &&
          new Date(reservation.bankHold.expiresAt).getTime() <= Date.now();
        if (!isAwaiting || isExpired) {
          localStorage.removeItem(PENDING_BANK_HOLD_STORAGE_KEY);
          return;
        }
        setPendingBankHoldReservation({
          reservationId: String(reservation._id),
          restaurantId: String(reservation.restaurant_id),
          customerFirstName: reservation.customerFirstName || "",
          reservationDate: reservation.reservationDate,
          reservationTime: reservation.reservationTime,
          numberOfGuests: reservation.numberOfGuests,
          expiresAt: reservation?.bankHold?.expiresAt || null,
        });
        setShowPendingBankHoldModal(true);
      } catch (error) {
        console.error("[restorePendingBankHold]", error);
        localStorage.removeItem(PENDING_BANK_HOLD_STORAGE_KEY);
      }
    }
    if (restaurant?._id && apiBaseUrl) {
      restorePendingBankHold();
    }
  }, [apiBaseUrl, restaurant?._id]);
  function isToday(date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
  function getServiceBucketFromTime(reservationTime) {
    const [hh = "0"] = String(reservationTime || "00:00").split(":");
    return Number(hh) < 16 ? "lunch" : "dinner";
  }
  function getOccupancyMinutesFront(parameters, reservationTime) {
    const bucket = getServiceBucketFromTime(reservationTime);
    const value =
      bucket === "lunch"
        ? parameters?.table_occupancy_lunch_minutes
        : parameters?.table_occupancy_dinner_minutes;
    const parsed = Number(value || 0);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }
  function minutesFromHHmm(timeStr) {
    const [hour, minute] = String(timeStr || "00:00").split(":").map(Number);
    return (Number(hour) || 0) * 60 + (Number(minute) || 0);
  }
  function isBlockingReservationFront(reservation) {
    if (!reservation) return false;
    if (
      !["AwaitingBankHold", "Pending", "Confirmed", "Active", "Late"].includes(
        reservation.status,
      )
    ) {
      return false;
    }
    if (reservation.status === "AwaitingBankHold") {
      const bankHoldEnabled = Boolean(reservation?.bankHold?.enabled);
      const bankHoldExpiresAt = reservation?.bankHold?.expiresAt
        ? new Date(reservation.bankHold.expiresAt).getTime()
        : null;
      if (
        bankHoldEnabled &&
        Number.isFinite(bankHoldExpiresAt) &&
        bankHoldExpiresAt <= Date.now()
      ) {
        return false;
      }
      return true;
    }
    if (reservation.status !== "Pending") return true;
    const bankHoldEnabled = Boolean(reservation?.bankHold?.enabled);
    const bankHoldExpiresAt = reservation?.bankHold?.expiresAt
      ? new Date(reservation.bankHold.expiresAt).getTime()
      : null;
    if (
      bankHoldEnabled &&
      Number.isFinite(bankHoldExpiresAt) &&
      bankHoldExpiresAt <= Date.now()
    ) {
      return false;
    }
    if (!reservation.pendingExpiresAt) return true;
    return new Date(reservation.pendingExpiresAt).getTime() > Date.now();
  }
  function requiredTableSizeFromGuestsFront(value) {
    const guests = Number(value || 0);
    if (guests <= 0) return 0;
    if (guests === 1) return 1;
    return guests % 2 === 0 ? guests : guests + 1;
  }
  function generateTimeOptions(openTime, closeTime, interval) {
    const times = [];
    const [openHour, openMinute] = openTime.split(":").map(Number);
    const [closeHour, closeMinute] = closeTime.split(":").map(Number);
    const start = openHour * 60 + openMinute;
    const end = closeHour * 60 + closeMinute;
    const step = parseInt(String(interval), 10);
    if (isNaN(step) || step <= 0) return times;
    for (let minutes = start; minutes <= end; minutes += step) {
      const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
      const minute = String(minutes % 60).padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
    return times;
  }
  useEffect(() => {
    if (!restaurant?._id || !reservationData.reservationDate) return;
    setIsLoading(true);
    if (reservationsListLoading) return;
    const selectedDay = reservationData.reservationDate.getDay();
    const dayIndex = selectedDay === 0 ? 6 : selectedDay - 1;
    const dayHours = parameters.same_hours_as_restaurant
      ? openingHours[dayIndex]
      : parameters.reservation_hours?.[dayIndex];
    if (!dayHours || dayHours.isClosed) {
      setAvailableTimes([]);
      setIsLoading(false);
      return;
    }
    if (!Array.isArray(dayHours.hours) || dayHours.hours.length === 0) {
      setAvailableTimes([]);
      setIsLoading(false);
      return;
    }
    const interval = parameters.interval || 30;
    let all = dayHours.hours.flatMap(({ open, close }) =>
      generateTimeOptions(open, close, interval),
    );
    if (isToday(reservationData.reservationDate)) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      all = all.filter((time) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m > currentMinutes;
      });
    }
    if (manage && reservationData.numberOfGuests) {
      const required = requiredTableSizeFromGuestsFront(
        reservationData.numberOfGuests,
      );
      const formattedSelectedDate = format(
        reservationData.reservationDate,
        "yyyy-MM-dd",
      );

      if (required > 0) {
        const eligibleTables = tablesCatalog.filter(
          (table) =>
            Number(table?.seats || 0) === required &&
            table?.onlineBookable !== false,
        );

        const dayReservations = reservationsList.filter((reservation) => {
          const reservationDate = new Date(reservation.reservationDate);
          const formattedReservationDate = format(
            reservationDate,
            "yyyy-MM-dd",
          );

          return (
            formattedReservationDate === formattedSelectedDate &&
            isBlockingReservationFront(reservation)
          );
        });

        all = all.filter((time) => {
          if (!eligibleTables.length) return false;

          const candidateStart = minutesFromHHmm(time);
          const candidateDuration = getOccupancyMinutesFront(parameters, time);
          const candidateEnd = candidateStart + candidateDuration;

          const conflicts = dayReservations.filter((reservation) => {
            if (!reservation?.table) return false;

            const reservationTableId = reservation?.table?._id
              ? String(reservation.table._id)
              : null;
            const reservationTableName = String(
              reservation?.table?.name || "",
            );

            const matchesEligibleTable = eligibleTables.some((table) => {
              const tableId = table?._id ? String(table._id) : null;

              if (tableId && reservationTableId) {
                return tableId === reservationTableId;
              }

              return String(table?.name || "") === reservationTableName;
            });

            if (!matchesEligibleTable) return false;

            const reservationTime = String(
              reservation.reservationTime || "",
            ).slice(0, 5);
            const reservationStart = minutesFromHHmm(reservationTime);
            const reservationDuration = getOccupancyMinutesFront(
              parameters,
              reservationTime,
            );
            const reservationEnd = reservationStart + reservationDuration;

            if (candidateDuration > 0 && reservationDuration > 0) {
              return (
                candidateStart < reservationEnd &&
                candidateEnd > reservationStart
              );
            }

            return reservationTime === String(time).slice(0, 5);
          });

          return conflicts.length < eligibleTables.length;
        });
      }
    }
    setAvailableTimes(all);
    setIsLoading(false);
  }, [
    restaurant,
    reservationData.reservationDate,
    reservationData.numberOfGuests,
    parameters.interval,
    parameters.manage_disponibilities,
    parameters.reservation_hours,
    parameters.same_hours_as_restaurant,
    parameters.table_occupancy_lunch_minutes,
    parameters.table_occupancy_dinner_minutes,
    reservationsList,
    reservationsListLoading,
    openingHours,
    tablesCatalog,
  ]);
  function formatTimeDisplay(time) {
    const [h, m] = time.split(":");
    return `${h}h${m}`;
  }
  function handleInputChange(e) {
    const { name, value } = e.target;
    setReservationData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "numberOfGuests" ? { reservationTime: "" } : {}),
    }));
  }
  function handleDateChange(d) {
    setReservationData((prev) => ({
      ...prev,
      reservationDate: d,
      reservationTime: "",
    }));
  }
  function disableClosedDays({ date, view }) {
    if (view !== "month") return false;
    const selectedDay = date.getDay();
    const dayIndex = selectedDay === 0 ? 6 : selectedDay - 1;
    const dayHours = parameters.same_hours_as_restaurant
      ? openingHours[dayIndex]
      : parameters.reservation_hours?.[dayIndex];
    return !!dayHours?.isClosed;
  }
  function handleResumePendingBankHold() {
    if (!pendingBankHoldReservation?.reservationId) return;
    window.location.href = `/reservations/${pendingBankHoldReservation.reservationId}/bank-hold`;
  }
  async function handleCancelPendingBankHold() {
    if (!pendingBankHoldReservation?.reservationId) return;
    try {
      setIsCancelingPendingBankHold(true);
      const res = await fetch(
        `${apiBaseUrl}/reservations/${pendingBankHoldReservation.reservationId}/cancel-pending-bank-hold`,
        { method: "POST", headers: { "Content-Type": "application/json" } },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.message || "Impossible d’annuler la réservation en attente.",
        );
      }
      localStorage.removeItem(PENDING_BANK_HOLD_STORAGE_KEY);
      setPendingBankHoldReservation(null);
      setShowPendingBankHoldModal(false);
      await fetchReservationsList();
    } catch (err) {
      setError(
        err?.message || "Impossible d’annuler la réservation en attente.",
      );
    } finally {
      setIsCancelingPendingBankHold(false);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!reservationData.reservationTime) {
      setError("Veuillez sélectionner un horaire.");
      return;
    }
    if (!reservationData.numberOfGuests) {
      setError("Veuillez renseigner le nombre de personnes.");
      return;
    }
    if (
      !reservationData.customerFirstName.trim() ||
      !reservationData.customerLastName.trim()
    ) {
      setError("Veuillez renseigner le prénom et le nom.");
      return;
    }
    if (!reservationData.customerPhone.trim()) {
      setError("Veuillez renseigner un numéro de téléphone.");
      return;
    }
    setIsSubmitting(true);
    let tablePayload = null;
    if (manage) {
      if (reservationData.table && reservationData.table !== "auto") {
        tablePayload = reservationData.table;
      }
    } else {
      tablePayload = reservationData.table || null;
    }
    const payload = {
      reservationDate: format(reservationData.reservationDate, "yyyy-MM-dd"),
      reservationTime: reservationData.reservationTime,
      numberOfGuests: reservationData.numberOfGuests,
      customerFirstName: reservationData.customerFirstName.trim(),
      customerLastName: reservationData.customerLastName.trim(),
      customerEmail: reservationData.customerEmail.trim(),
      customerPhone: reservationData.customerPhone.trim(),
      commentary: reservationData.commentary,
      table: tablePayload || undefined,
      returnUrl: `${window.location.origin}/reservations`,
      idempotencyKey,
    };
    try {
      const res = await fetch(
        `${apiBaseUrl}/restaurants/${restaurant._id}/reservations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Erreur lors de la réservation");
      }
      const data = await res.json();
      if (data?.requiresAction && data?.redirectUrl && data?.reservationId) {
        localStorage.setItem(
          PENDING_BANK_HOLD_STORAGE_KEY,
          JSON.stringify({
            reservationId: String(data.reservationId),
            restaurantId: String(restaurant._id),
            customerFirstName: reservationData.customerFirstName.trim(),
            reservationDate: format(
              reservationData.reservationDate,
              "yyyy-MM-dd",
            ),
            reservationTime: reservationData.reservationTime,
            numberOfGuests: reservationData.numberOfGuests,
          }),
        );
        window.location.href = data.redirectUrl;
        return;
      }
      await fetchReservationsList();
      onBooked?.(data.restaurant || restaurant);
      setReservationData((prev) => ({
        ...prev,
        reservationTime: "",
        customerFirstName: "",
        customerLastName: "",
        customerEmail: "",
        customerPhone: "",
        commentary: "",
        table: manage ? "auto" : "",
      }));
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }
  const peopleOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => String(i + 1));
  }, []);
  return (
    <>
      {showPendingBankHoldModal && pendingBankHoldReservation && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[620px] rounded-[22px] bg-[#f8f5ef] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.18)] tablet:rounded-[28px] tablet:p-8">
            <h3 className="yeseva-one-regular text-[24px] uppercase leading-[1.04] tracking-[-0.03em] text-[#111111] tablet:text-[30px]">
              Réservation en attente
            </h3>
            <p className="mt-4 text-[15px] font-light leading-[1.8] text-black/65 tablet:text-[17px]">
              {pendingBankHoldReservation.customerFirstName
                ? `${pendingBankHoldReservation.customerFirstName}, `
                : ""}
              vous avez une réservation en attente de validation d’empreinte
              bancaire.
            </p>
            <div className="mt-6 rounded-[18px] border border-[#b48a45]/20 bg-white/70 p-4 tablet:rounded-[22px] tablet:p-5">
              <div className="grid gap-4 text-[14px] text-black/70 tablet:text-[15px] desktop:grid-cols-3">
                <p>
                  <span className="block text-[11px] uppercase tracking-[0.22em] text-[#b48a45] tablet:text-[12px] tablet:tracking-[0.28em]">
                    Date
                  </span>
                  {format(
                    new Date(pendingBankHoldReservation.reservationDate),
                    "dd/MM/yyyy",
                  )}
                </p>
                <p>
                  <span className="block text-[11px] uppercase tracking-[0.22em] text-[#b48a45] tablet:text-[12px] tablet:tracking-[0.28em]">
                    Heure
                  </span>
                  {pendingBankHoldReservation.reservationTime}
                </p>
                <p>
                  <span className="block text-[11px] uppercase tracking-[0.22em] text-[#b48a45] tablet:text-[12px] tablet:tracking-[0.28em]">
                    Personnes
                  </span>
                  {pendingBankHoldReservation.numberOfGuests}
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 tablet:flex-row tablet:justify-end">
              <button
                type="button"
                onClick={handleCancelPendingBankHold}
                disabled={isCancelingPendingBankHold}
                className="flex h-[50px] items-center justify-center border border-[#111111]/10 px-5 text-[12px] font-medium uppercase tracking-[0.18em] text-[#111111] transition hover:opacity-80 disabled:opacity-50 tablet:h-[52px] tablet:px-6 tablet:text-[13px] tablet:tracking-[0.22em]"
              >
                {isCancelingPendingBankHold
                  ? "Annulation..."
                  : "Annuler la réservation"}
              </button>
              <button
                type="button"
                onClick={handleResumePendingBankHold}
                className="flex h-[50px] items-center justify-center bg-[#bb924b] px-5 text-[12px] font-medium uppercase tracking-[0.18em] text-white transition hover:opacity-90 tablet:h-[52px] tablet:px-6 tablet:text-[13px] tablet:tracking-[0.22em]"
              >
                <span className="mr-2 text-[10px] opacity-80">◆</span> Finaliser
                <span className="ml-2 text-[10px] opacity-80">◆</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="w-full bg-[#eeebe6] px-5 py-20 text-[#111111] tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[90px]">
        <div className="mx-auto max-w-[1600px]">
          <div className="mx-auto max-w-[1380px]">
            <div className="mx-auto max-w-[980px] text-center">
              <p className="mb-4 text-[12px] font-light uppercase tracking-[0.28em] text-[#b48a45] tablet:mb-5 tablet:text-[14px] tablet:tracking-[0.42em] desktop:text-[16px]">
                Réservation
              </p>
              <h2 className="yeseva-one-regular text-balance text-[28px] uppercase leading-[1.04] tracking-[-0.04em] text-[#111111] tablet:text-[34px] desktop:text-[38px]">
                Nous avons hâte de vous voir
              </h2>
              <p className="mx-auto mt-5 max-w-[760px] text-[15px] font-light leading-[1.8] text-black/60 tablet:mt-6 tablet:text-[16px] tablet:leading-[1.85] desktop:text-[18px]">
                Choisissez votre date, votre horaire et renseignez vos
                informations pour finaliser votre réservation.
              </p>
            </div>
            {!dataLoading ? (
              <form
                onSubmit={handleSubmit}
                className="mt-10 flex flex-col gap-8 tablet:mt-12 tablet:gap-10 desktop:mt-14"
              >
                {/* PERSONNES */}
                <div className="w-full tablet:w-[320px] desktop:w-[calc(50%-12px)]">
                  <label className="mb-3 block text-[11px] uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[12px] tablet:tracking-[0.32em]">
                    Personnes
                  </label>
                  <div className="relative">
                    <select
                      name="numberOfGuests"
                      value={reservationData.numberOfGuests}
                      onChange={handleInputChange}
                      className="h-[52px] w-full appearance-none border border-[#111111]/10 bg-white/50 px-4 pr-11 text-[15px] font-light text-[#111111] outline-none transition focus:border-[#b48a45] tablet:h-[56px] tablet:px-5 tablet:pr-12 tablet:text-[17px]"
                    >
                      {peopleOptions.map((value) => (
                        <option key={value} value={value}>
                          {value} {Number(value) > 1 ? "personnes" : "personne"}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      strokeWidth={1.4}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#111111]"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8 tablet:gap-6 desktop:flex-row">
                  {/* CALENDAR */}
                  <div className="border border-[#b48a45]/20 bg-white/50 p-4 tablet:w-full tablet:p-6 desktop:w-1/2 desktop:p-7">
                    <div className="mb-5">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[12px] tablet:tracking-[0.32em]">
                        Calendrier
                      </p>
                      <h3 className="yeseva-one-regular mt-3 text-[22px] uppercase leading-[1.06] tracking-[-0.03em] text-[#111111] tablet:text-[28px] desktop:text-[30px]">
                        Choisissez votre date
                      </h3>
                    </div>
                    <div className="reservation-calendar-wrapper overflow-hidden">
                      <Calendar
                        onChange={handleDateChange}
                        value={reservationData.reservationDate}
                        view="month"
                        locale="fr-FR"
                        tileDisabled={disableClosedDays}
                        minDate={new Date()}
                        className="reservation-calendar w-full border-none bg-transparent"
                      />
                    </div>
                  </div>
                  {/* TIMES */}
                  <div className="relative border border-[#b48a45]/20 bg-white/50 p-4 tablet:w-full tablet:p-6 desktop:w-1/2 desktop:p-7">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[12px] tablet:tracking-[0.32em]">
                          Disponibilités
                        </p>
                        <h3 className="yeseva-one-regular mt-3 text-[22px] uppercase leading-[1.06] tracking-[-0.03em] text-[#111111] tablet:text-[28px] desktop:text-[30px]">
                          Sélectionnez un horaire
                        </h3>
                      </div>
                      {isLoading && (
                        <div className="absolute left-1/2 top-[80%] tablet:top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-[13px] text-black/50 tablet:text-[14px]">
                          <Loader2 size={16} className="animate-spin" />
                          Chargement...
                        </div>
                      )}
                    </div>
                    {!isLoading && availableTimes.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 tablet:grid-cols-3 desktop:grid-cols-4">
                        {availableTimes.map((time) => {
                          const isActive =
                            reservationData.reservationTime === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() =>
                                setReservationData((prev) => ({
                                  ...prev,
                                  reservationTime: time,
                                }))
                              }
                              disabled={!reservationData.numberOfGuests}
                              className={`min-w-0 border px-3 py-3 text-[14px] font-light transition tablet:px-4 tablet:text-[15px] ${isActive ? "border-[#bb924b] bg-[#bb924b] text-white" : "border-[#111111]/10 bg-white text-[#111111] hover:border-[#b48a45] hover:text-[#b48a45]"}`}
                            >
                              {formatTimeDisplay(time)}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      !isLoading && (
                        <p className="text-[15px] font-light leading-[1.8] text-black/55 tablet:text-[17px]">
                          Aucun créneau disponible pour cette date.
                        </p>
                      )
                    )}
                  </div>
                </div>
                {/* FORM */}
                <div className="border border-[#b48a45]/20 bg-white/50 p-4 tablet:p-6 desktop:p-7">
                  <div className="mb-7 tablet:mb-8">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[12px] tablet:tracking-[0.32em]">
                      Vos informations
                    </p>
                    <h3 className="yeseva-one-regular mt-3 text-[22px] uppercase leading-[1.06] tracking-[-0.03em] text-[#111111] tablet:text-[28px] desktop:text-[30px]">
                      Finalisez la réservation
                    </h3>
                  </div>
                  <div className="grid gap-5 tablet:grid-cols-2">
                    <Field
                      label="Prénom*"
                      name="customerFirstName"
                      value={reservationData.customerFirstName}
                      onChange={handleInputChange}
                      type="text"
                    />
                    <Field
                      label="Nom*"
                      name="customerLastName"
                      value={reservationData.customerLastName}
                      onChange={handleInputChange}
                      type="text"
                    />
                    <Field
                      label="Email*"
                      name="customerEmail"
                      value={reservationData.customerEmail}
                      onChange={handleInputChange}
                      type="email"
                    />
                    <Field
                      label="Téléphone*"
                      name="customerPhone"
                      value={reservationData.customerPhone}
                      onChange={handleInputChange}
                      type="tel"
                    />
                    <div className="tablet:col-span-2">
                      <label className="mb-3 block text-[11px] uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[12px] tablet:tracking-[0.32em]">
                        Commentaire
                      </label>
                      <textarea
                        name="commentary"
                        value={reservationData.commentary}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full resize-none border border-[#111111]/10 bg-white px-4 py-4 text-[15px] font-light text-[#111111] outline-none transition focus:border-[#b48a45] tablet:px-5 tablet:text-[16px]"
                        placeholder="Une demande particulière ?"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700 tablet:text-[15px]">
                      {error}
                    </div>
                  )}
                  <div className="mt-8 flex justify-start tablet:justify-end">
                    <button
                      type="submit"
                      // disabled={true}
                      disabled={
                        !reservationData.reservationTime ||
                        isLoading ||
                        isSubmitting
                      }
                      className="flex h-[52px] w-full items-center justify-center bg-[#bb924b] px-5 text-[12px] font-medium uppercase tracking-[0.22em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 tablet:h-[56px] tablet:w-auto tablet:min-w-[220px] tablet:px-6 tablet:text-[13px] tablet:tracking-[0.28em]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={18} className="animate-spin" />
                          Envoi...
                        </span>
                      ) : (
                        <>
                          <span className="mr-2 text-[10px] opacity-80">◆</span>
                          Confirmer
                          <span className="ml-2 text-[10px] opacity-80">◆</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <p className="flex h-[320px] w-full items-center justify-center gap-2 tablet:h-[400px]">
                Chargement <Loader2 size={18} className="animate-spin" />
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <div>
      <label className="mb-3 block text-[11px] uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[12px] tablet:tracking-[0.32em]">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-[52px] w-full border border-[#111111]/10 bg-white px-4 text-[15px] font-light text-[#111111] outline-none transition focus:border-[#b48a45] tablet:h-[56px] tablet:px-5 tablet:text-[16px]"
      />
    </div>
  );
}
