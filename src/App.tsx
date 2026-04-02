import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppLayout from "@/components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import PeoplePage from "./pages/PeoplePage";
import ListsPage from "./pages/ListsPage";
import PartyDetailPage from "./pages/PartyDetailPage";
import ExplorePage from "./pages/ExplorePage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import MockupPage from "./pages/MockupPage";
import AboutPage from "./pages/AboutPage";
import DonatePage from "./pages/DonatePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
      <FavoritesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/lists" element={<ListsPage />} />
              <Route path="/lists/:id" element={<PartyDetailPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/explore/:key" element={<CategoryDetailPage />} />
              <Route path="/mockups" element={<MockupPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/donate" element={<DonatePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
