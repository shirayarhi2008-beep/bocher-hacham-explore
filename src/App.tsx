import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import AppLayout from "@/components/layout/AppLayout";
import PeoplePage from "./pages/PeoplePage";
import ListsPage from "./pages/ListsPage";
import ExplorePage from "./pages/ExplorePage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FavoritesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<PeoplePage />} />
              <Route path="/lists" element={<ListsPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/explore/:key" element={<CategoryDetailPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
