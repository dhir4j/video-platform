
export default function ShortsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use a minimal layout for the immersive shorts feed.
  // The AppShell is removed to allow for a full-screen experience.
  return <div className="h-screen w-screen bg-black">{children}</div>;
}
