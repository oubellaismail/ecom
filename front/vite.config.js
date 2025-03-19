import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'vite-plugin-tailwindcss'; // Assuming you're using a plugin for Tailwind CSS

export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // Correctly include the Tailwind CSS plugin
  ],
  server: {
    port: 3000,
  }
});
