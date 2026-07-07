export default function TimeTrackerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="container py-8">{children}</div>;
}
