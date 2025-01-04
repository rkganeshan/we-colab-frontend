import configLocal from "./config.local.json";
import configProd from "./config.prod.json";

interface Config {
  API_BASE_URL: string;
}

const configs: Record<string, Config> = {
  local: configLocal,
  prod: configProd,
};

const mode = import.meta.env.VITE_APP_MODE || "prod";

const config = configs[mode];

if (!config) {
  throw new Error(`Invalid VITE_APP_MODE: ${mode}`);
}

export default config;
