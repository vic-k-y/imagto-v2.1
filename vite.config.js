import { resolve } from "path";
import { build } from "vite";

export default {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        app: resolve(__dirname, "app.html"),
        login: resolve(__dirname, "login.html"),
      },
    },
  },
};
