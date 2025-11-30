import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-emerald-100 flex flex-col items-center justify-center font-sans">
      <header className="w-full py-16 text-center bg-white shadow-md rounded-b-3xl mb-12">
        <h1 className="text-6xl font-extrabold text-green-800 mb-6 leading-tight">
          GrocerEase: Freshness at Your Doorstep
        </h1>
        <p className="text-2xl text-gray-700 max-w-2xl mx-auto">
          Your ultimate solution for effortless grocery shopping. Quality products, unbeatable prices, and speedy delivery.
        </p>
      </header>

      <main className="flex flex-col md:flex-row items-center justify-center p-8 space-y-12 md:space-y-0 md:space-x-16 w-full max-w-6xl">
        <section className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 text-center max-w-sm flex-1">
          <h2 className="text-4xl font-bold text-gray-900 mb-5">Shop Now</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Explore our extensive catalog of farm-fresh produce, organic essentials, and gourmet delights. Start your healthy lifestyle today!
          </p>
          <Link
            to="/home"
            className="inline-block bg-green-600 text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Start Shopping
          </Link>
        </section>

        <section className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 text-center max-w-sm flex-1">
          <h2 className="text-4xl font-bold text-gray-900 mb-5">Admin Portal</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Manage products, oversee orders, and streamline operations with our powerful administrator interface. Exclusively for staff.
          </p>
          <Link
            to="/admin"
            className="inline-block bg-blue-600 text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Admin Login
          </Link>
        </section>
      </main>

      <footer className="w-full py-10 text-center text-gray-600 mt-16 bg-white shadow-inner rounded-t-3xl">
        <p className="text-lg">&copy; {new Date().getFullYear()} GrocerEase. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
