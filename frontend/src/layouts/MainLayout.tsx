import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  return (
    <>
      <Header />
      <div className="">
        <Sidebar />
        <main className="min-h-screen pt-16 pb-20 md:pb-0 md:pl-30 bg-slate-50 text-slate-900">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}

export default MainLayout;
