import { Header } from "./Header";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
    </div>
  );
}
