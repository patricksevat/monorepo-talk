import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'checkout',

  exposes: {
    './Module': './src/remote-entry.js',
    './CartOverlay': './src/components/CartOverlay',
  },
};

export default config;
