import type { Metadata } from "next";
import "./globals.css";
import { LayoutWrapper } from "../components/LayoutWrapper";

export const metadata: Metadata = {
  title: "HealthCare - Your Trusted Healthcare Partner",
  description: "Comprehensive healthcare services for you and your family",
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
