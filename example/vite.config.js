import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import cesium from 'vite-plugin-cesium';
import path from "path";

// https://vite.dev/config/
console.log(__dirname);
export default defineConfig({
  plugins: [react(), cesium()],
  resolve: {
    alias: {
      cesium: path.resolve(__dirname, "node_modules/cesium/Build/Cesium"), // Ensure the correct Cesium path
    },}
    
})

