export default function ShortsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-hidden bg-black">
      {children}
    </div>
  );
}
