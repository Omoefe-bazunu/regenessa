"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ManageProducts from "@/components/admin/ManageProducts";
import InquiryList from "@/components/admin/InquiryList";
import ManageOrders from "@/components/admin/ManageOrders";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldAlert,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState("products");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const ADMIN_EMAIL = "raniem57@gmail.com";
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
    { id: "messages", label: "Inquiries", icon: MessageSquare },
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
        <h1 className="font-heading text-3xl mb-2">Access Denied</h1>
        <p className="text-foreground/60 max-w-sm">
          You do not have permission to view this page. Redirecting you to the
          home page...
        </p>
      </div>
    );
  }

  return (
    <div className="relative mt-20 min-h-screen bg-[#FDFDFD] dark:bg-[#080E0B]">
      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-brand-dark border-b border-border z-[60] flex items-center justify-between px-6">
        <h1 className="font-heading text-lg text-brand-primary">
          Clean Foods Admin
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-brand-dark dark:text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex pt-16 lg:pt-0">
        {/* --- SIDEBAR --- */}
        <aside
          className={`
          fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-brand-dark border-r border-border p-6 flex flex-col transition-transform duration-300 ease-in-out z-[70]
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="mb-10 px-4 mt-8 lg:mt-0">
            <h1 className="font-heading text-2xl text-brand-primary hidden lg:block">
              Clean Foods
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
              Admin Panel v1.0
            </p>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                    activeMenu === item.id
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                      : "text-foreground/60 hover:bg-brand-warm dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="font-bold text-sm">{item.label}</span>
                  </div>
                  {activeMenu === item.id && <ChevronRight size={16} />}
                </button>
              );
            })}
          </nav>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-4 text-red-500 font-bold text-sm mt-auto border-t border-border hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </aside>

        {/* --- MOBILE OVERLAY --- */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-[65]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 p-6 lg:p-12 overflow-x-hidden">
          <header className="mb-10">
            <h2 className="font-heading text-3xl text-brand-dark dark:text-white capitalize">
              {menuItems.find((i) => i.id === activeMenu)?.label}
            </h2>
            <p className="text-foreground/40 text-sm">
              Managing your store essentials.
            </p>
          </header>

          <div className="animate-fade-in">
            {activeMenu === "products" && <ManageProducts />}
            {activeMenu === "messages" && <InquiryList />}
            {activeMenu === "overview" && <ManageOrders />}
          </div>
        </main>
      </div>
    </div>
  );
}
