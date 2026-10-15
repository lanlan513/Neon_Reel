import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { MovieDetailPage } from './pages/MovieDetailPage.tsx';
import { MoviesPage } from './pages/MoviesPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

/** Route table for the three MVP pages plus the catch-all. */
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="movies" element={<MoviesPage />} />
        <Route path="movies/:id" element={<MovieDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
