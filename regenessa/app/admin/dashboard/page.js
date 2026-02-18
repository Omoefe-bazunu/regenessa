"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ManageProducts from "@/components/admin/ManageProducts";
import InquiryList from "@/components/admin/InquiryList";
import ManageOrders from "@/components/admin/ManageOrders";
import ManageConsultations from "@/components/admin/ManageConsultations";
import UploadTestimonial from "@/components/admin/ManageTestimonial";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Stethoscope,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldAlert,
  Loader2,
  QuoteIcon,
  ChartAreaIcon,
  Quote,
  Package2Icon,
  CircleQuestionMark,
  Star,
} from "lucide-react";
import AdminReviews from "@/components/admin/ManageReviews";
import ProductAnalytics from "@/components/admin/products-analytics";
import ManagePackages from "@/components/admin/ManagePackages";
import ManageCerts from "@/components/admin/ManageCerts";
import ManageFAQs from "@/components/admin/ManageFAQs";
import ManageFeaturedProducts from "@/components/admin/ManageFeaturerdProducts";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const ADMIN_EMAIL = "patience@regenessa.com";
  const isAuthorized = user && user.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!authLoading && !isAuthorized) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthorized, authLoading, router]);

  const menuItems = [
    { id: "overview", label: "Manage Orders", icon: LayoutDashboard },
    { id: "products", label: "Manage Products", icon: Package },
    { id: "consultations", label: "Consultations", icon: Stethoscope },
    { id: "messages", label: "Inquiries", icon: MessageSquare },
    { id: "reviews", label: "Reviews", icon: QuoteIcon },
    { id: "testimonials", label: "Testimonials", icon: Quote },
    { id: "packages", label: "Packages", icon: Package2Icon },
    { id: "certifications", label: "Certifications", icon: ShieldAlert },
    { id: "faqs", label: "faqs", icon: CircleQuestionMark },
    { id: "analytics", label: "Analytics", icon: ChartAreaIcon },
    { id: "featured", label: "Featured Products", icon: Star },
  ];

  const handleMenuClick = (id) => {
    setActiveMenu(id);
    setIsMobileMenuOpen(false);
  };

  if (authLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-brand-warm dark:bg-brand-dark">
        <Loader2 className="animate-spin text-brand-primary mb-4" size={40} />
        <p className="text-xs font-bold uppercase tracking-widest opacity-40 text-center">
          Verifying Admin Session...
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-brand-warm dark:bg-brand-dark px-6 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert size={40} />
        </div>
        <h1 className="font-syne text-3xl mb-2 font-bold">Access Denied</h1>
        <p className="font-jakarta text-foreground/60 max-w-sm">
          Redirecting to secure home page...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FDFDFD] dark:bg-[#080E0B]">
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-brand-dark border-b border-border z-[60] flex items-center justify-between px-6">
        <h1 className="font-syne font-bold text-lg text-brand-primary uppercase">
          REGENESSA ADMIN
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-brand-dark dark:text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-brand-dark border-r border-border p-6 flex flex-col transition-transform duration-300 ease-in-out z-[70] lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* LOGO SECTION (Fixed) */}
          <div className="mb-10 px-4 mt-8 lg:mt-0 flex-shrink-0">
            <h1 className="font-syne text-2xl font-black text-brand-primary hidden lg:block uppercase tracking-tighter">
              REGENESSA
            </h1>
            <p className="text-[10px] font-jakarta font-bold uppercase tracking-widest opacity-40">
              Clinical Control Panel
            </p>
          </div>

          {/* SCROLLABLE NAV SECTION */}
          <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-sm transition-all ${
                    activeMenu === item.id
                      ? "bg-brand-primary text-white shadow-lg"
                      : "text-foreground/60 hover:bg-brand-warm dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span className="font-jakarta font-bold text-xs uppercase tracking-widest">
                      {item.label}
                    </span>
                  </div>
                  {activeMenu === item.id && <ChevronRight size={14} />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 lg:p-12 overflow-x-hidden pt-24 lg:pt-12">
          <header className="mb-10 animate-page-reveal">
            <h2 className="font-syne text-3xl font-bold text-brand-dark dark:text-white uppercase tracking-tighter">
              {menuItems.find((i) => i.id === activeMenu)?.label}
            </h2>
            <p className="font-jakarta text-foreground/40 text-xs uppercase tracking-widest mt-1">
              Regenessa Management Hub
            </p>
          </header>

          <div className="animate-fade-in">
            {activeMenu === "products" && <ManageProducts />}
            {activeMenu === "messages" && <InquiryList />}
            {activeMenu === "overview" && <ManageOrders />}
            {activeMenu === "consultations" && <ManageConsultations />}
            {activeMenu === "reviews" && <AdminReviews />}
            {activeMenu === "testimonials" && <UploadTestimonial />}
            {activeMenu === "packages" && <ManagePackages />}
            {activeMenu === "certifications" && <ManageCerts />}
            {activeMenu === "faqs" && <ManageFAQs />}
            {activeMenu === "analytics" && <ProductAnalytics />}
            {activeMenu === "featured" && <ManageFeaturedProducts />}
          </div>
        </main>
      </div>

      {/* INTERNAL CSS FOR NO-SCROLLBAR */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
