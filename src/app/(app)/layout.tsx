import { BottomBar } from "~/components/bottom-bar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative">
      {children}
      <BottomBar />
    </div>
  );
}
