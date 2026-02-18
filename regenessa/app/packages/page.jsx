// app/packages/page.js
import PackagesClient from "./PackagesClient";

export const metadata = {
  title: "Stem Cell Wellness Packages | REGENESSA",
  description:
    "Curated plant stem cell treatment plans tailored for specific health goals. Choose from our Vitality, Longevity, and Recovery bundles.",
  openGraph: {
    title: "Health & Vitality Packages | REGENESSA",
    description:
      "Scientifically backed stem cell therapy bundles for comprehensive cellular health.",
    url: "https://www.regenessa.com/packages",
    siteName: "REGENESSA",
    images: [
      {
        url: "https://www.regenessa.com/og-packages.jpg",
        width: 1200,
        height: 630,
        alt: "REGENESSA Wellness Packages",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
};

export default function PackagesPage() {
  return <PackagesClient />;
}
