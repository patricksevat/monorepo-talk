/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Route, Routes } from 'react-router-dom';

import CheckoutPage from '../pages/checkout/index';

export function App() {
  return (
    <Routes>
      <Route path="/*" element={<CheckoutPage />} />
    </Routes>
  );
}

export default App;
