
export default function ShortsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use a minimal layout for the immersive shorts feed.
  // This provides the full-screen black canvas for the player.
  return <div className="h-screen w-screen bg-black">{children}</div>;
}
