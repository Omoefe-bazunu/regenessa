// app/blog/page.js
import BlogClient from "./BlogClient";

export const metadata = {
  title: "Health Insights & Regenerative Wellness Blog | REGENESSA",
  description:
    "Read the latest articles on plant stem cell therapy, cellular rejuvenation, and verified success stories from the REGENESSA wellness hub.",
  openGraph: {
    title: "REGENESSA Health Blog",
    description: "Expert insights into Phytoscience stem cell solutions.",
    url: "https://www.regenessa.com/blog",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
