
export default function ShortsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-[calc(100vh-4rem)] md:h-screen w-full bg-black overflow-hidden">{children}</div>;
}
