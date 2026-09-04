import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';


function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);

  // ================= USER DETAILS =================
  const fetchUserDetails = async () => {
    try {
      const dataResponse = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include'
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        dispatch(setUserDetails(dataApi.data));
      }
    } catch (error) {
      console.log("User fetch error:", error);
    }
  };

  // ================= CART COUNT =================
  const fetchUserAddToCart = async () => {
    try {
      const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: 'include'
      });

      const dataApi = await dataResponse.json();

      setCartProductCount(dataApi?.data?.count || 0);
    } catch (error) {
      console.log("Cart fetch error:", error);
      setCartProductCount(0);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    const init = async () => {
      await fetchUserDetails();
      await fetchUserAddToCart();
    };

    init();
  }, []);

  return (
    <Context.Provider
      value={{
        fetchUserDetails,
        cartProductCount,
        fetchUserAddToCart
      }}
    >
      {/* TOAST */}
      <ToastContainer position="top-center" />

      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="min-h-[calc(100vh-120px)] pt-16">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* CHATBOT (FLOATING / GLOBAL ACCESS) */}
      <ChatBot />
    </Context.Provider>
  );
}

export default App;