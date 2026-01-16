import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import MyBookings from "@/components/myBooking";
import Link from "next/link";

export const metadata = {
  title: "Boss Baby Photo Studio | Book Your Session",
  description: "Professional baby photography sessions at Boss Baby Photo Studio",
  icons: {
    icon: "/logo.png",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* Header / Navbar */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-2">

          <div className="flex flex-col items-center gap-0">

            {/* Logo */}
            <div>
              <Image
                src="/logo.png"
                alt="Boss Baby Photo Studio"
                width={200}
                height={50}
                priority
                className="object-contain"
              />
            </div>

            {/* Tagline */}
            <p className="text-center text-slate-600 text-sm sm:text-base font-medium max-w-xl">
              Turn Your Baby’s Cherished Moments into Forever Memories With Us
            </p>

            {/* Phone / WhatsApp */}
            <div className="text-sm text-slate-600 font-medium flex justify-center ">
              <Link href="https://wa.me/918799445104?text=I%20want%20to%20book%20an%20apointment"
                target="_blank"
                className="hover:text-slate-900 transition sm:py-2 py-6">
                📞 +91 87994 45104
              </Link>
            </div>

          </div>

        </div>
      </header>




      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* Studio Timings */}
        <section className="bg-white rounded-xl border shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Studio Timings
          </h2>

          <div className="max-w-md mx-auto space-y-4 text-slate-600">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Morning Session</span>
              <span>10:30 AM – 1:00 PM</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Afternoon Session</span>
              <span>2:30 PM – 8:30 PM</span>
            </div>

            <p className="text-center text-sm text-slate-500 pt-4">
              Each photoshoot session lasts 30 minutes
            </p>
          </div>
        </section>

        {/* Booking Form */}
        <section className="bg-white rounded-xl border shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Book an Appointment
          </h2>
          <BookingForm />
        </section>

        {/* My Bookings */}
        <section className="bg-white rounded-xl border shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            My Bookings
          </h2>
          <MyBookings />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <p className="text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Boss Baby Photo Studio. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
