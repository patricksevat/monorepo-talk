import { Route, Routes } from 'react-router-dom';

import PagesHome from '../pages/home';
import ProductsPage from '../pages/products';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PagesHome />} />
      <Route path="/home" element={<PagesHome />} />
      <Route path="/products" element={<ProductsPage />} />
    </Routes>
  );
}

export default App;
