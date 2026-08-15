import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/layout/BottomNav";
import ScrollToTop from "../components/ScrollToTop";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  LoadingKitStyles,
  RouteTransitionLoading,
} from "../components/LoadingKit";

function MainLayout() {
  return (
    <>
      <LoadingKitStyles />
      <RouteTransitionLoading />
      <ScrollToTop />
      <Header />
      <div>
        <Sidebar />
        <main className="min-h-screen bg-slate-50 pt-16 pb-[calc(4rem+env(safe-area-inset-bottom,0px))] text-slate-900 lg:pb-0 lg:pl-30">
          <div className="page-content">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
      <BottomNav />
    </>
  );
}
export default MainLayout;
