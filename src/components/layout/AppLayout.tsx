import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import MobileNav from './MobileNav';
import Footer from './Footer';
import FavoritesDrawer from './FavoritesDrawer';

export default function AppLayout() {
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenFavorites={() => setFavoritesOpen(true)} />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <FavoritesDrawer open={favoritesOpen} onClose={() => setFavoritesOpen(false)} />
    </div>
  );
}
