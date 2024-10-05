import * as React from 'react';

import { Route, Routes } from 'react-router-dom';

// @ts-expect-error - js apps are not type-checked
const RemoteCheckout = React.lazy(() => import('checkout/Module'));

const DiscoverRemote = React.lazy(() => import('discover/Module'));

export function App() {
  return (
    // TODO: add a loader fallback
    <React.Suspense fallback={null}>
      <Routes>
        <Route path="/*" element={<DiscoverRemote />} />

        <Route path="/checkout" element={<RemoteCheckout />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
