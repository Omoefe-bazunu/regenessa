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
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { cartCount } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  const navItems = [
    { name: "Home", href: "/", icon: Leaf },
    { name: "Supplements", href: "/products", icon: LayoutGrid },
    { name: "Track Orders", href: "/orders", icon: History },
    { name: "Contact", href: "/contact", icon: PhoneCall },
  ];

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 w-full">
        {/* TOP ANNOUNCEMENT BAR */}
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

        {/* MAIN NAVBAR */}
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
              {/* User Icon - Desktop */}
              <Link
                href={user ? "/profile" : "/login"}
                className="hidden lg:block relative group p-1"
                aria-label={user ? "Profile" : "Sign in"}
              >
                <User
                  size={21}
                  className="text-brand-dark group-hover:text-brand-primary transition-colors"
                />
              </Link>

              {/* Cart Icon */}
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-foreground/5 rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X size={24} className="text-brand-dark" />
                ) : (
                  <Menu size={24} className="text-brand-dark" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 z-[60] bg-brand-warm transition-all duration-500 lg:hidden ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-10 pb-10">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-brand-primary/10 text-brand-dark hover:bg-brand-primary hover:text-white transition-all"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>

          <span className="font-heading text-brand-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-8">
            NAVIGATION
          </span>

          <nav className="flex flex-col">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              const isLast = idx === navItems.length - 1;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between py-5 group transition-all ${
                    !isLast ? "border-b border-border" : ""
                  } ${
                    isMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${idx * 40}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <item.icon
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? "text-brand-primary"
                          : "text-foreground/20 group-hover:text-brand-primary"
                      }`}
                    />
                    <span
                      className={`font-heading text-xl tracking-tight group-hover:text-brand-primary transition-colors ${
                        isActive ? "text-brand-primary" : "text-brand-dark"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={
                      isActive ? "text-brand-primary" : "text-foreground/10"
                    }
                  />
                </Link>
              );
            })}

            <Link
              href={user ? "/profile" : "/login"}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between py-5 border-t border-border mt-4 transition-all ${
                isMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
              style={{ transitionDelay: `${navItems.length * 40}ms` }}
            >
              <div className="flex items-center gap-4">
                <User size={20} className="text-brand-accent" />
                <span className="font-heading text-xl text-brand-dark">
                  {user ? "Dashboard" : "Sign In"}
                </span>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
