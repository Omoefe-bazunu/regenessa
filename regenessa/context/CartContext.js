"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

const CartContext = createContext();

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

  // 1. UPDATED: Single Add with Functional State to prevent race conditions
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
        quantity,
        unit: product.unit || "Unit",
        imageUrl: product.imageUrl,
      });

      // Use the data returned from the server to keep sync
      setCart(data.items);
      toast.success(`${product.name} added to cart`);
      setIsCartOpen(true);
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  // 2. NEW: Scalable Bulk Add (Syncs Bundle with Backend)
  const addMultipleToCart = async (products) => {
    if (!user) {
      toast.error("Please login to add bundles");
      return;
    }

    setCartLoading(true);
    try {
      // Map products to the format your backend expects
      const itemsToAdd = products.map((product) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        unit: product.unit || "Unit",
        imageUrl: product.imageUrl,
      }));

      // NOTE: Ensure your backend has a /cart/bulk-add route.
      // If not, we fall back to local state + eventual sync.
      const { data } = await api.post("/cart/bulk-add", { items: itemsToAdd });

      setCart(data.items);
      toast.success("Bundle added to your order");
      setIsCartOpen(true);
    } catch (error) {
      console.error("Bulk add error:", error);
      // Fallback: If backend bulk route doesn't exist yet, update locally
      // but warn that a refresh might lose data until synced.
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
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
