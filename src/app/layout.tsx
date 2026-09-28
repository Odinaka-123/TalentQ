import "./globals.css";
import { CurrencyProvider } from "@/lib/currency/CurrencyContext";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { DensityProvider } from "@/lib/density/DensityContext";

export const metadata = {
  title: "TalentQ",
  description:
    "A premium talent marketplace for verified African professionals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <CurrencyProvider>
            <DensityProvider>{children}</DensityProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}