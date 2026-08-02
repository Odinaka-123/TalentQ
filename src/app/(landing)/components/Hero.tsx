import { Search } from "lucide-react";
import TypingText from "./TypingText";

export default function Hero() {
  return (
    <section className="w-full flex justify-center px-4 pt-8 sm:pt-15 pb-8">
      <div className="w-full max-w-6xl rounded-4xl border border-[#C36A34] bg-[#1B3A2F] px-5 sm:px-6 py-12 sm:py-16 md:py-20 flex flex-col items-center text-center shadow-[0px_4px_10px_3px_#DE814A]">
        <span className="rounded-full border border-[#749389] bg-[#48655C] px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-[#C36A34] mb-6 sm:mb-8">
          <TypingText text="Built for African freelancers and businesses" />
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-2xl">
          Find work you can trust.
          <br />
          Hire talent you can verify.
        </h1>

        <p className="mt-4 sm:mt-6 text-[#8CABA1] text-sm sm:text-base md:text-lg max-w-xl">
          No fake listings. No pay-to-win visibility. Your money stays protected
          until the work is done.
        </p>

        <form className="mt-8 sm:mt-10 w-full max-w-lg flex items-center rounded-full border-2 border-[#DE814A] bg-[#FFF] pl-4 sm:pl-6 pr-2 py-2">
          <input
            type="text"
            placeholder="Search for any services"
            className="flex-1 min-w-0 bg-transparent text-sm text-[#3F4A44] placeholder:text-[#7A8580] outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex items-center justify-center rounded-full border-[#DE814A] bg-[#A8531E] w-9 h-9 shrink-0 hover:bg-[#B04A32] transition-colors"
          >
            <Search size={16} className="text-white" />
          </button>
        </form>
      </div>
    </section>
  );
}
