import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import ProductDetail from './components/ProductDetail';
import SearchResultsPage from './components/SearchResultPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search/:query" element={<SearchResultsPage />} />
        {/* Các route khác */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
