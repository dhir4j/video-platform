
export default function ShortsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full w-full bg-background overflow-hidden">{children}</div>;
}
