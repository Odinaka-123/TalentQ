import "./globals.css";
import "@/styles/dark-theme.css";
import { CurrencyProvider } from "@/lib/currency/CurrencyContext";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { DensityProvider } from "@/lib/density/DensityContext";
import { ThemeProvider } from "@/lib/theme/ThemeContext";

export const metadata = {
  title: "TalentQ",
  description:
    "A premium talent marketplace for verified African professionals",
};

const initScript = `
(function () {
  try {
    var t = localStorage.getItem("app-theme");
    if (t === "dark" || t === "light") document.documentElement.dataset.theme = t;
    var d = localStorage.getItem("app-density");
    if (d === "compact" || d === "comfortable" || d === "spacious")
      document.documentElement.dataset.density = d;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <LanguageProvider>
          <CurrencyProvider>
            <DensityProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </DensityProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}