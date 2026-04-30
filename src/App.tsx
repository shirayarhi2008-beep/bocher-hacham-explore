import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import HomePage from './pages/HomePage';
import PeoplePage from './pages/PeoplePage';
import ListsPage from './pages/ListsPage';
import PartyDetailPage from './pages/PartyDetailPage';
import CandidatePage from './pages/CandidatePage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';
import { CompareProvider } from '@/context/CompareContext';
import CompareModal from '@/components/CompareModal';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CompareProvider>
      <CompareModal />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/lists" element={<ListsPage />} />
            <Route path="/lists/:id" element={<PartyDetailPage />} />
            <Route path="/candidates/:id" element={<CandidatePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </CompareProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
