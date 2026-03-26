import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/Layout/ClientLayout";

export const metadata: Metadata = {
  title: "Taste of Home | Palestinian & Lebanese Heritage Recipes",
  description: "Authentic traditional recipes, stories, and culinary heritage from Palestinian and Lebanese kitchens. Preserving family secrets for generations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-cream">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
