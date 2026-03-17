import Head from "next/head";
import BankHoldReservationsComponent from "@/components/reservations/bank-hold.reservations.component";

export default function ReservationBankHoldPage({ reservationId }) {
  return (
    <>
      <Head>
        <title>Validation carte - A l'Assiette</title>
      </Head>

      <BankHoldReservationsComponent
        reservationId={reservationId}
        apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
        stripePublishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const { reservationId } = context.params;

  return {
    props: {
      reservationId: reservationId || null,
    },
  };
}
