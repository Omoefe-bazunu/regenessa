"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

const CartContext = createContext();

// ─── Helper: resolve the effective unit price based on quantity ───
const getEffectivePrice = (item) => {
  const setPrice = Number(item.setPrice);
  const setQty = Number(item.setQuantity);
  if (setPrice && setQty && item.quantity >= setQty) {
    return setPrice;
  }
  return Number(item.price);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      if (cart.length > 0) setCart([]);
      return;
    }

    const fetchCart = async () => {
      setCartLoading(true);
      try {
        const { data } = await api.get("/cart");
        setCart(data.items || []);
      } catch (error) {
        console.error("Cart fetch error:", error);
      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  }, [user, authLoading]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      toast.error("Please login to start shopping");
      return;
    }
    try {
      const { data } = await api.post("/cart/add", {
        productId: product.id,
        name: product.name,
        price: product.price,
        // Pass set pricing fields so the cart item carries them
        setPrice: product.setPrice || null,
        setQuantity: product.setQuantity || null,
        quantity,
        unit: product.unit || "Unit",
        imageUrl: product.imageUrl,
      });

      setCart(data.items);
      toast.success(`${product.name} added to cart`);
      setIsCartOpen(true);
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const addMultipleToCart = async (products) => {
    if (!user) {
      toast.error("Please login to add bundles");
      return;
    }

    setCartLoading(true);
    try {
      const itemsToAdd = products.map((product) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        setPrice: product.setPrice || null,
        setQuantity: product.setQuantity || null,
        quantity: 1,
        unit: product.unit || "Unit",
        imageUrl: product.imageUrl,
      }));

      const { data } = await api.post("/cart/bulk-add", { items: itemsToAdd });

      setCart(data.items);
      toast.success("Bundle added to your order");
      setIsCartOpen(true);
    } catch (error) {
      console.error("Bulk add error:", error);
      toast.error("Issue syncing bundle to server");
    } finally {
      setCartLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const { data } = await api.put(`/cart/item/${productId}`, {
        quantity: newQuantity,
      });
      setCart(data.items);
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/item/${productId}`);
      setCart(data.items);
      toast.success("Item removed");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear");
      setCart([]);
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // ─── cartTotal now uses effective pricing ───
  const cartTotal = cart.reduce((total, item) => {
    return total + getEffectivePrice(item) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        updateQuantity,
        cart,
        addToCart,
        addMultipleToCart,
        cartCount,
        cartTotal,
        cartLoading,
        clearCart,
        removeFromCart,
        isCartOpen,
        setIsCartOpen,
        getEffectivePrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
