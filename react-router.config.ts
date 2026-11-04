import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender: ["/", "/services", "/projects", "/about", "/process", "/contact"],
} satisfies Config;
