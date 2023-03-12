export {};

type Config = {
  apiUrl: string;
};

declare global {
  interface Window {
    config: Config;
  }
}
