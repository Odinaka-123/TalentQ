import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
