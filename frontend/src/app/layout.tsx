import { AuthProvider } from "@/utility/Auth";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ubc donuts",
  description: "get donutty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
