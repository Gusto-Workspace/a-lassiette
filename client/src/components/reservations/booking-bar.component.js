import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { CalendarDays, ChevronDown, Loader2 } from "lucide-react";
import {
  formatReservationDateForApi,
  getAvailableReservationTimes,
} from "@/utils/reservations";

const peopleOptions = Array.from({ length: 12 }, (_, index) =>
  String(index + 1),
);

function formatTimeDisplay(time) {
  const [hour, minute] = String(time || "").split(":");
  return `${hour}h${minute}`;
}

function getThemeClasses(theme) {
  if (theme === "light") {
    return {
      title: "text-[#022401]",
      control:
        "border-[#022401]/20 bg-white/10 text-[#022401] focus:border-[#bb924b]",
      controlInvalid: "border-[#c55050] bg-[#fff4f1] text-[#022401]",
      icon: "text-[#022401]/80",
    };
  }

  return {
    title: "text-white",
    control:
      "border-white/20 bg-black/10 text-white focus:border-[#bb924b] focus:bg-black/15",
    controlInvalid:
      "border-[#d68b8b] bg-[rgba(120,28,28,0.28)] text-white focus:border-[#d68b8b]",
    icon: "text-white/80",
  };
}

export default function BookingBarComponent({
  restaurant,
  theme = "dark",
  className = "",
}) {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const themeClasses = getThemeClasses(theme);
  const [bookingData, setBookingData] = useState(() => ({
    numberOfGuests: "2",
    reservationDate: formatReservationDateForApi(new Date()),
    reservationTime: "",
  }));
  const [reservationsList, setReservationsList] = useState([]);
  const [reservationsListLoading, setReservationsListLoading] = useState(false);
  const [invalidField, setInvalidField] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchReservationsList() {
      if (!apiBaseUrl || !restaurant?._id) {
        if (isMounted) {
          setReservationsList([]);
          setReservationsListLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setReservationsListLoading(true);
        }

        const response = await fetch(
          `${apiBaseUrl}/public/restaurants/${restaurant._id}/reservations`,
        );
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message || "Impossible de charger les réservations.",
          );
        }

        if (isMounted) {
          setReservationsList(
            Array.isArray(data?.reservations) ? data.reservations : [],
          );
        }
      } catch (fetchError) {
        console.error(
          "[BookingBarComponent][fetchReservationsList]",
          fetchError,
        );
        if (isMounted) {
          setReservationsList([]);
        }
      } finally {
        if (isMounted) {
          setReservationsListLoading(false);
        }
      }
    }

    fetchReservationsList();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, restaurant?._id]);

  const availableTimes = useMemo(() => {
    if (reservationsListLoading) return [];

    return getAvailableReservationTimes({
      reservationDate: bookingData.reservationDate,
      numberOfGuests: bookingData.numberOfGuests,
      restaurant,
      reservationsList,
    });
  }, [
    bookingData.numberOfGuests,
    bookingData.reservationDate,
    reservationsList,
    reservationsListLoading,
    restaurant,
  ]);

  useEffect(() => {
    if (!bookingData.reservationTime) return;
    if (availableTimes.includes(bookingData.reservationTime)) return;

    setBookingData((prev) => ({
      ...prev,
      reservationTime: "",
    }));
  }, [availableTimes, bookingData.reservationTime]);

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setInvalidField("");
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
      ...(name !== "reservationTime" ? { reservationTime: "" } : {}),
    }));
  }

  async function handleSubmit() {
    setInvalidField("");

    if (!restaurant?._id) {
      return;
    }

    if (!bookingData.reservationDate) {
      setInvalidField("reservationDate");
      return;
    }

    if (!bookingData.reservationTime) {
      setInvalidField("reservationTime");
      return;
    }

    if (!availableTimes.includes(bookingData.reservationTime)) {
      setInvalidField("reservationTime");
      return;
    }

    await router.push({
      pathname: "/reservations",
      query: {
        reservationDate: bookingData.reservationDate,
        reservationTime: bookingData.reservationTime,
        numberOfGuests: bookingData.numberOfGuests,
      },
    });
  }

  return (
    <div
      className={`absolute bottom-6 left-5 right-5 z-30 flex flex-col gap-3 p-0 tablet:bottom-8 tablet:left-8 tablet:right-8 tablet:gap-4 desktop:bottom-[52px] desktop:left-[10%] desktop:right-[10%] min-[1150px]:flex-row min-[1150px]:flex-nowrap min-[1150px]:items-center min-[1150px]:gap-4 ultraWild:gap-6 ${className}`}
    >
      <div className="mb-1 shrink-0 min-[1150px]:mb-0">
        <h2
          className={`yeseva-one-regular text-[26px] leading-[0.95] tracking-[-0.03em] tablet:text-[30px] desktop:text-[22px] desktop:leading-[0.9] ${themeClasses.title}`}
        >
          Réserver une table
        </h2>
      </div>

      <FieldWrapper>
        <select
          name="numberOfGuests"
          value={bookingData.numberOfGuests}
          onChange={handleFieldChange}
          aria-invalid={invalidField === "numberOfGuests"}
          className={`h-[52px] w-full appearance-none border px-5 pr-11 text-left text-[16px] font-light outline-none transition tablet:px-6 tablet:text-[17px] min-[1150px]:text-[16px] ultraWild:text-[18px] ${invalidField === "numberOfGuests" ? themeClasses.controlInvalid : themeClasses.control}`}
        >
          {peopleOptions.map((value) => (
            <option key={value} value={value} className="text-[#111111]">
              {value} {Number(value) > 1 ? "Personnes" : "Personne"}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          strokeWidth={1.4}
          className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${themeClasses.icon}`}
        />
      </FieldWrapper>

      <FieldWrapper>
        <input
          type="date"
          name="reservationDate"
          min={formatReservationDateForApi(new Date())}
          value={bookingData.reservationDate}
          onChange={handleFieldChange}
          aria-invalid={invalidField === "reservationDate"}
          className={`h-[52px] w-full appearance-none border px-5 pr-11 text-left text-[16px] font-light outline-none transition [color-scheme:inherit] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 tablet:px-6 tablet:text-[17px] min-[1150px]:text-[16px] ultraWild:text-[18px] ${invalidField === "reservationDate" ? themeClasses.controlInvalid : themeClasses.control}`}
          style={{ colorScheme: theme === "dark" ? "dark" : "light" }}
        />
        <CalendarDays
          size={18}
          strokeWidth={1.4}
          className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${themeClasses.icon}`}
        />
      </FieldWrapper>

      <FieldWrapper>
        <select
          name="reservationTime"
          value={bookingData.reservationTime}
          onChange={handleFieldChange}
          disabled={!restaurant?._id || reservationsListLoading}
          aria-invalid={invalidField === "reservationTime"}
          className={`h-[52px] w-full appearance-none border px-5 pr-11 text-left text-[16px] font-light outline-none transition disabled:cursor-not-allowed disabled:opacity-60 tablet:px-6 tablet:text-[17px] min-[1150px]:text-[16px] ultraWild:text-[18px] ${invalidField === "reservationTime" ? themeClasses.controlInvalid : themeClasses.control}`}
        >
          <option value="" className="text-[#111111]">
            {reservationsListLoading
              ? "Chargement..."
              : availableTimes.length > 0
                ? "Choisir un horaire"
                : "Aucun créneau"}
          </option>
          {availableTimes.map((time) => (
            <option key={time} value={time} className="text-[#111111]">
              {formatTimeDisplay(time)}
            </option>
          ))}
        </select>
        {reservationsListLoading ? (
          <Loader2
            size={18}
            className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 animate-spin ${themeClasses.icon}`}
          />
        ) : (
          <ChevronDown
            size={18}
            strokeWidth={1.4}
            className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${themeClasses.icon}`}
          />
        )}
      </FieldWrapper>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!restaurant?._id || reservationsListLoading}
        className="flex h-[52px] w-full items-center justify-center bg-[#bb924b] px-2 text-[12px] font-medium uppercase tracking-[0.22em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 tablet:text-[13px] min-[1150px]:ml-auto min-[1150px]:w-[172px] min-[1150px]:shrink-0 desktop:text-[14px] desktop:tracking-[0.28em]"
      >
        <span className="mr-2 text-[10px] opacity-80">◆</span>
        Valider
        <span className="ml-2 text-[10px] opacity-80">◆</span>
      </button>
    </div>
  );
}

function FieldWrapper({ children }) {
  return (
    <div className="relative w-full min-[1150px]:min-w-0 min-[1150px]:flex-[1_1_0px]">
      {children}
    </div>
  );
}
