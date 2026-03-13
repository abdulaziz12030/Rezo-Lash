import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import BookingForm from "@/components/BookingForm";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <BookingForm />
    </main>
  );
}
