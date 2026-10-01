import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import CartDrawer from "@/components/ui/CartDrawer";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: { default: "PawVerse 3D | Pet Care, Reimagined", template: "%s | PawVerse 3D" },
  description: "Shop premium pet food, toys and accessories in an immersive 3D store. Rotate, zoom and explore every product in 360°.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#7c3aed" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </AuthProvider>
      </body>
    </html>
  );
}
