import Hero from "../components/Hero.jsx";
import Services from "../components/Services.jsx";
import Products from "../components/Products.jsx";
import EventForm from "../components/EventForm.jsx";
import Reviews from "../components/Reviews.jsx";
import FAQs from "../components/FAQs.jsx";
import ContactForm from "../components/ContactForm.jsx";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Products />
      <EventForm />
      <Reviews />
      <FAQs />
      <ContactForm />
    </main>
  );
}
