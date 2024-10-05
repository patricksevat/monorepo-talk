import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'discover',

  exposes: {
    './Module': './src/remote-entry.ts',
  },

  remotes: ['checkout'],
};

export default config;
