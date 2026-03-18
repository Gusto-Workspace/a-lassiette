import { useEffect, useMemo, useState } from "react";
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
  const parameters = restaurant?.reservations?.parameters || {};
  const reservationsList = restaurant?.reservations?.list || [];
  const openingHours = restaurant?.opening_hours || [];
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

  useEffect(() => {
    setReservationData((prev) => ({ ...prev, table: manage ? "auto" : "" }));
  }, [manage]);

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
  function generateTimeOptions(openTime, closeTime, interval) {
    const times = [];
    const [openHour, openMinute] = openTime.split(":").map(Number);
    const [closeHour, closeMinute] = closeTime.split(":").map(Number);
    const start = openHour * 60 + openMinute;
    const end = closeHour * 60 + closeMinute;
    const step = parseInt(String(interval), 10);
    if (isNaN(step) || step <= 0) return times;
    for (let minutes = start; minutes <= end - step; minutes += step) {
      const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
      const minute = String(minutes % 60).padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
    return times;
  }
  useEffect(() => {
    if (!restaurant?.reservations || !reservationData.reservationDate) return;
    setIsLoading(true);
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
      const num = Number(reservationData.numberOfGuests);
      const required = num % 2 === 0 ? num : num + 1;
      const formattedSelectedDate = format(
        reservationData.reservationDate,
        "yyyy-MM-dd",
      );
      if (parameters.reservation_duration) {
        const duration = Number(parameters.reservation_duration_minutes);
        all = all.filter((time) => {
          const [hour, minute] = time.split(":").map(Number);
          const candidateStart = hour * 60 + minute;
          const candidateEnd = candidateStart + duration;
          const conflicts = reservationsList.filter((r) => {
            const rDate = new Date(r.reservationDate);
            const formattedRDate = format(rDate, "yyyy-MM-dd");
            if (formattedRDate !== formattedSelectedDate) return false;
            if (!["Confirmed", "Late", "Active"].includes(r.status)) {
              return false;
            }
            if (!r.table || Number(r.table.seats) !== required) return false;
            const [rHour, rMinute] = r.reservationTime.split(":").map(Number);
            const rStart = rHour * 60 + rMinute;
            const rEnd = rStart + duration;
            return candidateStart < rEnd && candidateEnd > rStart;
          });
          const totalTables = (parameters.tables || []).filter(
            (t) => Number(t.seats) === required,
          ).length;
          return conflicts.length < totalTables;
        });
      } else {
        all = all.filter((time) => {
          const conflicts = reservationsList.filter((r) => {
            const rDate = new Date(r.reservationDate);
            const formattedRDate = format(rDate, "yyyy-MM-dd");
            if (formattedRDate !== formattedSelectedDate) return false;
            if (r.reservationTime !== time) return false;
            if (!["Confirmed", "Late", "Active"].includes(r.status)) {
              return false;
            }
            if (!r.table || Number(r.table.seats) !== required) return false;
            return true;
          });
          const totalTables = (parameters.tables || []).filter(
            (t) => Number(t.seats) === required,
          ).length;
          return conflicts.length < totalTables;
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
    parameters.reservation_duration,
    parameters.reservation_duration_minutes,
    reservationsList,
    openingHours,
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
      onBooked?.(data.restaurant);
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
          <div className="w-full max-w-[620px] rounded-[28px] bg-[#f8f5ef] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)] sm:p-8">
            <h3 className="yeseva-one-regular text-[30px] uppercase leading-[1.04] tracking-[-0.03em] text-[#111111]">
              Réservation en attente
            </h3>
            <p className="mt-4 text-[17px] font-light leading-[1.8] text-black/65">
              {pendingBankHoldReservation.customerFirstName
                ? `${pendingBankHoldReservation.customerFirstName}, `
                : ""}
              vous avez une réservation en attente de validation d’empreinte
              bancaire.
            </p>
            <div className="mt-6 rounded-[22px] border border-[#b48a45]/20 bg-white/70 p-5">
              <div className="grid gap-3 text-[15px] text-black/70 sm:grid-cols-3">
                <p>
                  <span className="block text-[12px] uppercase tracking-[0.28em] text-[#b48a45]">
                    Date
                  </span>
                  {format(
                    new Date(pendingBankHoldReservation.reservationDate),
                    "dd/MM/yyyy",
                  )}
                </p>
                <p>
                  <span className="block text-[12px] uppercase tracking-[0.28em] text-[#b48a45]">
                    Heure
                  </span>
                  {pendingBankHoldReservation.reservationTime}
                </p>
                <p>
                  <span className="block text-[12px] uppercase tracking-[0.28em] text-[#b48a45]">
                    Personnes
                  </span>
                  {pendingBankHoldReservation.numberOfGuests}
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelPendingBankHold}
                disabled={isCancelingPendingBankHold}
                className="flex h-[52px] items-center justify-center border border-[#111111]/10 px-6 text-[13px] font-medium uppercase tracking-[0.22em] text-[#111111] transition hover:opacity-80 disabled:opacity-50"
              >
                {isCancelingPendingBankHold
                  ? "Annulation..."
                  : "Annuler la réservation"}
              </button>
              <button
                type="button"
                onClick={handleResumePendingBankHold}
                className="flex h-[52px] items-center justify-center bg-[#bb924b] px-6 text-[13px] font-medium uppercase tracking-[0.22em] text-white transition hover:opacity-90"
              >
                <span className="mr-2 text-[10px] opacity-80">◆</span> Finaliser
                <span className="ml-2 text-[10px] opacity-80">◆</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="w-full bg-[#eeebe6] px-[90px] py-[90px] text-[#111111]">
        <div className="mx-auto max-w-[1600px]">
          <div className="mx-auto max-w-[1380px]">
            <div className="mx-auto max-w-[980px] text-center">
              <p className="mb-5 text-[14px] font-light uppercase tracking-[0.42em] text-[#b48a45] tablet:text-[16px]">
                Réservation
              </p>
              <h2 className="yeseva-one-regular text-[38px] uppercase leading-[1.04] tracking-[-0.04em] text-[#111111]">
                Nous avons hâte de vous voir
              </h2>
              <p className="text-balance mx-auto mt-6 max-w-[760px] text-[18px] font-light leading-[1.85] text-black/60">
                Choisissez votre date, votre horaire et renseignez vos
                informations pour finaliser votre réservation.
              </p>
            </div>
            {!dataLoading ? (
              <form
                onSubmit={handleSubmit}
                className="mt-14 flex flex-col gap-10 tablet:gap-6"
              >
                {/* PERSONNES */}
                <div className="relative w-[calc(50%-12px)]">
                  <label className="mb-3 block text-[12px] uppercase tracking-[0.32em] text-[#b48a45]">
                    Personnes
                  </label>
                  <div className="relative">
                    <select
                      name="numberOfGuests"
                      value={reservationData.numberOfGuests}
                      onChange={handleInputChange}
                      className="h-[56px] w-full appearance-none border border-[#111111]/10 bg-white/50 px-5 pr-12 text-[17px] font-light text-[#111111] outline-none transition focus:border-[#b48a45]"
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

                <div className="flex flex-col gap-10 tablet:flex-row tablet:gap-6">
                  {/* CALENDAR */}
                  <div className="border border-[#b48a45]/20 bg-white/50 p-5 sm:p-7 tablet:w-1/2">
                    <div className="mb-5">
                      <p className="text-[12px] uppercase tracking-[0.32em] text-[#b48a45]">
                        Calendrier
                      </p>
                      <h3 className="yeseva-one-regular mt-3 text-[30px] uppercase leading-[1.06] tracking-[-0.03em] text-[#111111]">
                        Choisissez votre date
                      </h3>
                    </div>

                    <div className="reservation-calendar-wrapper">
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
                  <div className="relative border border-[#b48a45]/20 bg-white/50 p-5 sm:p-7 tablet:w-1/2">
                    <div className="mb-5 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.32em] text-[#b48a45]">
                          Disponibilités
                        </p>

                        <h3 className="yeseva-one-regular mt-3 text-[30px] uppercase leading-[1.06] tracking-[-0.03em] text-[#111111]">
                          Sélectionnez un horaire
                        </h3>
                      </div>

                      {isLoading && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-[14px] text-black/50">
                          <Loader2 size={16} className="animate-spin" />
                          Chargement...
                        </div>
                      )}
                    </div>

                    {!isLoading && availableTimes.length > 0 ? (
                      <div className="grid grid-cols-2 desktop:grid-cols-4 flex-wrap gap-2">
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
                              className={`min-w-[50px] border px-4 py-3 text-[15px] font-light transition ${isActive ? "border-[#bb924b] bg-[#bb924b] text-white" : "border-[#111111]/10 bg-white text-[#111111] hover:border-[#b48a45] hover:text-[#b48a45]"}`}
                            >
                              {formatTimeDisplay(time)}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      !isLoading && (
                        <p className="text-[17px] font-light leading-[1.8] text-black/55">
                          Aucun créneau disponible pour cette date.
                        </p>
                      )
                    )}
                  </div>
                </div>

                {/* FORM */}
                <div className="border border-[#b48a45]/20 bg-white/50 p-5 sm:p-7">
                  <div className="mb-8">
                    <p className="text-[12px] uppercase tracking-[0.32em] text-[#b48a45]">
                      Vos informations
                    </p>
                    <h3 className="yeseva-one-regular mt-3 text-[30px] uppercase leading-[1.06] tracking-[-0.03em] text-[#111111]">
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
                      <label className="mb-3 block text-[12px] uppercase tracking-[0.32em] text-[#b48a45]">
                        Commentaire
                      </label>
                      <textarea
                        name="commentary"
                        value={reservationData.commentary}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full resize-none border border-[#111111]/10 bg-white px-5 py-4 text-[16px] font-light text-[#111111] outline-none transition focus:border-[#b48a45]"
                        placeholder="Une demande particulière ?"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-[15px] text-red-700">
                      {error}
                    </div>
                  )}
                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={
                        !reservationData.reservationTime ||
                        isLoading ||
                        isSubmitting
                      }
                      className="flex h-[56px] min-w-[220px] items-center justify-center bg-[#bb924b] px-6 text-[13px] font-medium uppercase tracking-[0.28em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
              <p className="flex gap-2 w-full h-[400px] items-center justify-center">
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
      <label className="mb-3 block text-[12px] uppercase tracking-[0.32em] text-[#b48a45]">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-[56px] w-full border border-[#111111]/10 bg-white px-5 text-[16px] font-light text-[#111111] outline-none transition focus:border-[#b48a45]"
      />
    </div>
  );
}
