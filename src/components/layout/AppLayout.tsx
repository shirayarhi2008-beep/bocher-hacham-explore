import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import MobileNav from './MobileNav';
import Footer from './Footer';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6 max-w-content">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
