/// <reference types="vite/client" />

declare module "vuejs3-datepicker" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<any, any, any>;
  export default component;
}

declare interface ImportMetaEnv {
  readonly VITE_STORYBOOK_URL?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
