export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F1E9] px-4 py-10">
      {children}
    </div>
  );
}
