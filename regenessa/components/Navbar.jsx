"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  User,
  X,
  Leaf,
  LayoutGrid,
  History,
  PhoneCall,
  ChevronRight,
  Menu,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid Hydration Mismatch
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    }
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { name: "Home", href: "/", icon: Leaf },
    { name: "Supplements", href: "/products", icon: LayoutGrid },
    { name: "Track Orders", href: "/orders", icon: History },
    { name: "Contact", href: "/contact", icon: PhoneCall },
  ];

  // Prevent hydration mismatch with placeholder
  if (!mounted) {
    return <div className="h-20 bg-brand-warm border-b border-transparent" />;
  }

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 w-full">
        <div className="hidden lg:flex bg-brand-primary py-2.5 px-26 justify-between items-center border-b border-white/10 relative">
          <p className="text-[10px] font-jakarta font-bold text-white/60 uppercase tracking-[0.25em]">
            Innovating Regenerative Lifestyle Wellness • Clinical Grade
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] font-jakarta font-bold text-brand-accent uppercase tracking-widest">
              Nigeria • International Shipping Available
            </span>
          </div>
        </div>

        <div
          className={`transition-all duration-500 bg-brand-warm border-b ${
            scrolled
              ? "py-2 shadow-md border-border"
              : "py-4 border-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-16 flex items-center justify-between">
            <Link href="/" className="flex flex-col relative group">
              <span className="font-heading text-3xl font-extrabold tracking-[-0.05em] text-brand-primary leading-none uppercase">
                REGENESSA
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-12">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative py-1 text-[12px] font-jakarta font-bold uppercase tracking-[0.2em] transition-all ${
                      isActive
                        ? "text-brand-active"
                        : "text-foreground/60 hover:text-brand-active"
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute -bottom-1 left-0 h-[1.5px] bg-brand-active transition-all duration-500 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 md:gap-6">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="hidden lg:block relative group p-1"
                  aria-label="Logout"
                >
                  <LogOut
                    size={21}
                    className="text-brand-dark group-hover:text-red-500 transition-colors"
                  />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="hidden lg:block relative group p-1"
                  aria-label="Sign in"
                >
                  <User
                    size={21}
                    className="text-brand-dark group-hover:text-brand-primary transition-colors"
                  />
                </Link>
              )}

              <Link href="/cart" className="relative group p-1">
                <ShoppingCart
                  size={21}
                  className="text-brand-dark group-hover:text-brand-primary transition-colors"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-4.5 w-4.5 bg-brand-primary text-white text-[9px] font-black flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-foreground/5 rounded-md transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 z-[60] bg-brand-warm transition-all duration-500 lg:hidden ${
          isMenuOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-10 pb-10">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-brand-primary/10 text-brand-dark hover:bg-brand-primary hover:text-white transition-all"
          >
            <X size={22} />
          </button>

          <span className="font-heading text-brand-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-8">
            NAVIGATION
          </span>

          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-5 border-b border-border group"
              >
                <div className="flex items-center gap-4">
                  <item.icon
                    size={20}
                    className="text-brand-dark/20 group-hover:text-brand-primary transition-colors"
                  />
                  <span className="font-heading text-xl text-brand-dark">
                    {item.name}
                  </span>
                </div>
                <ChevronRight size={16} className="text-brand-dark/10" />
              </Link>
            ))}

            <div className="mt-4">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 w-full py-5 border-t border-border"
                >
                  <LogOut size={20} className="text-red-500" />
                  <span className="font-heading text-xl text-brand-dark">
                    Logout
                  </span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 py-5 border-t border-border"
                >
                  <User size={20} className="text-brand-accent" />
                  <span className="font-heading text-xl text-brand-dark">
                    Sign In
                  </span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
