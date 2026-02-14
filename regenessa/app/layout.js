import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeContext";
// import WhatsAppWidget from "@/components/WhatsAppWidget";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: {
    default: "Regenessa | Regenerative Wellness",
    template: "%s | Regenessa",
  },
  description:
    "Pioneering plant-based stem cell research to transform cellular health and human longevity. Premium products for a vibrant, long life.",
  keywords: [
    "Regenessa",
    "Stem Cell Supplements Nigeria",
    "Advanced Anti-aging",
    "Bio-Science Wellness",
    "Crystal Cell",
    "Actual +",
  ],
  openGraph: {
    title: "Regenessa | Science-Backed Longevity",
    description:
      "Innovating the future of regenerative health through natural science.",
    url: "https://www.regenessa.com",
    siteName: "Regenessa",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${plusJakarta.variable}`}>
      <body className="font-sans bg-brand-warm text-foreground antialiased ">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: "#0f172a",
                    color: "#f8fafc",
                    border: "1px solid #c5a059",
                  },
                }}
              />
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              {/* <WhatsAppWidget /> */}
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
