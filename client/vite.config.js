import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

export default defineConfig(({ command, mode }) => {
  // Load environment variables based on the current mode
  dotenv.config();

  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],

    define: {
      'process.env.GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
    },
  };
});
