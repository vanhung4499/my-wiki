import { onMounted } from "vue";
import { defineClientConfig } from "vuepress/client";
import NotFound from "./theme/layouts/NotFound.vue";
import Layout from "./theme/layouts/Layout.vue";
import News from "./theme/layouts/News.vue";
import Wormhole from "./theme/components/Wormhole";
import Travelling from "./theme/components/Travelling";
import "vuepress-theme-hope/presets/bounce-icon.scss";
import packageJson from "../../package.json";
export default defineClientConfig({
  // Add components to the app
  layouts: {
    Layout,
    NotFound,
    News,
  },
  enhance: ({ app }) => {
    app.component("Wormhole", Wormhole);
    app.component("Travelling", Travelling);
  },
  setup: () => {
    onMounted(() => {
      console.log(
        `%c ✨vanhung4499's Blog v${packageJson.version}✨ %c ✨vanhung4499's Blog✨ %c`,
        `background: #eb507e; padding:5px; font-size:12px; color: #f9f4dc;`,
        `background: #030307; padding:5px; font-size:12px; color:#fff;`,
        `color: #51c4d3; font-size:12px;`,
      );
    });
  },
});
