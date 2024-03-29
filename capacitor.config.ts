import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "in.vaibhavsinghh.flappybird",
  appName: "flappy-bird",
  webDir: "dist",
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
