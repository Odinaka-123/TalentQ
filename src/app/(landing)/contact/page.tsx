import ContactHero from "./components/ContactHero";
import ContactIntro from "./components/ContactIntro";
import ContactForm from "./components/ContactForm";

export default function ContactPage() {
  return (
    <div className="bg-[#F5F1E9] min-h-screen">
      <ContactHero />
      <ContactIntro />
      <ContactForm />
    </div>
  );
}
