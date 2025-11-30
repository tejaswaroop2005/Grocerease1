import { createContext, useContext, useEffect, useState } from "react";

const StoreContext = createContext();
export const useStore = () => useContext(StoreContext);

export default function StoreProvider({ children }) {
  // products persisted globally
  const [products, setProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("products"));
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5001/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products from server:", error);
        // Fallback to localStorage if server fetch fails
        const localProducts = JSON.parse(localStorage.getItem("products"));
        if (localProducts && localProducts.length > 0) {
          console.log("Loading products from localStorage as server fetch failed.");
          setProducts(localProducts);
        } else {
          // Fallback to hardcoded default products if neither server nor localStorage has data
          console.log("Loading hardcoded default products as server fetch and localStorage failed.");
          setProducts([
            { id: 1, name: "Fresh Bananas", price: 40, category: "Fruits", unit: "per dozen", stock: 100, image: "https://via.placeholder.com/150", description: "Fresh organic bananas" },
            { id: 2, name: "Red Apples", price: 120, category: "Fruits", unit: "per kg", stock: 80, image: "https://via.placeholder.com/150", description: "Crisp red apples" },
            { id: 3, name: "Milk", price: 60, category: "Dairy", unit: "1 Liter", stock: 50, image: "https://via.placeholder.com/150", description: "Fresh full cream milk" },
          ]);
        }
      }
    };
    fetchProducts();
  }, []); // Run once on mount

  // This useEffect will now persist products (fetched from server or fallback) to localStorage
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem("currentUser")) || null;
  });

  // User-specific cart state
  const [userCart, setUserCart] = useState([]);

  // Fetch user's cart on login
  useEffect(() => {
    const fetchUserCart = async () => {
      if (currentUser) {
        try {
          const response = await fetch(`http://localhost:5001/carts?userId=${currentUser.id}`);
          const carts = await response.json();
          if (carts.length > 0) {
            setUserCart(carts[0].items);
          } else {
            // Create a new cart for the user if none exists
            const newCartResponse = await fetch("http://localhost:5001/carts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: currentUser.id, items: [] }),
            });
            if (newCartResponse.ok) {
              const newCart = await newCartResponse.json();
              setUserCart(newCart.items);
            } else {
              console.error("Failed to create new cart for user");
              setUserCart([]);
            }
          }
        } catch (error) {
          console.error("Error fetching user cart:", error);
          setUserCart([]);
        }
      } else {
        setUserCart([]); // Clear cart if no user is logged in
      }
    };
    fetchUserCart();
  }, [currentUser]);

  // Persist current user to session storage
  useEffect(() => {
    if (currentUser) sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
    else sessionStorage.removeItem("currentUser");
  }, [currentUser]);

  // AUTH
  const loginUser = async (username, password) => {
    if (!username || !password) return { success: false, message: "Username and password are required." };

    try {
      const response = await fetch(`http://localhost:5001/users?username=${username}`);
      const users = await response.json();
      let user = users[0];

      if (user) {
        if (user.password === password) {
          setCurrentUser(user);
          return { success: true, user };
        } else {
          return { success: false, message: "Incorrect password." };
        }
      } else {
        const newUser = { username: username.trim(), password: password, role: "customer" };
        const registerResponse = await fetch("http://localhost:5001/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
        if (!registerResponse.ok) {
          const errorData = await registerResponse.json();
          throw new Error(errorData.message || "Failed to register user");
        }
        user = await registerResponse.json();
        setCurrentUser(user);
        return { success: true, user };
      }
    } catch (error) {
      console.error("Login/Registration error:", error);
      return { success: false, message: `Login/Registration failed: ${error.message}` };
    }
  };

  const logoutUser = async () => {
    if (currentUser) {
      // Save current user's cart before logging out
      try {
        const response = await fetch(`http://localhost:5001/carts?userId=${currentUser.id}`);
        const carts = await response.json();
        if (carts.length > 0) {
          const cartId = carts[0].id;
          await fetch(`http://localhost:5001/carts/${cartId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: userCart }),
          });
        }
      } catch (error) {
        console.error("Error saving cart before logout:", error);
      }
    }
    setCurrentUser(null);
    setUserCart([]);
  };

  // PRODUCTS (admin-only actions)
  const addNewProduct = async (product) => {
    try {
      const response = await fetch("http://localhost:5001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Failed to add product");
      const newProduct = await response.json();
      setProducts((prev) => [newProduct, ...prev]);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const response = await fetch(`http://localhost:5001/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update product");
      const updatedProduct = await response.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // CART OPERATIONS (per-user)
  const getCartFor = () => userCart;

  const updateCartOnBackend = async (newCartItems) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`http://localhost:5001/carts?userId=${currentUser.id}`);
      const carts = await response.json();
      if (carts.length > 0) {
        const cartId = carts[0].id;
        await fetch(`http://localhost:5001/carts/${cartId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: newCartItems }),
        });
        setUserCart(newCartItems);
      } else {
        console.error("User cart not found for update.");
      }
    } catch (error) {
      console.error("Error updating cart on backend:", error);
    }
  };

  const addToCart = (product) => {
    const exists = userCart.find((c) => c.id === product.id);
    let newCartItems;
    if (exists) {
      newCartItems = userCart.map((c) => (c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      newCartItems = [{ ...product, quantity: 1 }, ...userCart];
    }
    updateCartOnBackend(newCartItems);
  };

  const updateQuantity = (productId, qty) => {
    const newCartItems = userCart.map((c) => (c.id === productId ? { ...c, quantity: qty } : c));
    updateCartOnBackend(newCartItems);
  };

  const removeFromCart = (productId) => {
    const newCartItems = userCart.filter((c) => c.id !== productId);
    updateCartOnBackend(newCartItems);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addNewProduct,
        updateProduct,
        deleteProduct,

        currentUser,
        loginUser,
        logoutUser,

        getCartFor,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
