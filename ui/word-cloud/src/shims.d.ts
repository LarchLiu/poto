declare interface Options {
  pickerId: string;
  families: string[];
  categories: Category[];
  scripts: Script[];
  variants: Variant[];
  filter: (font: Font) => boolean;
  limit: number;
  sort: SortOption;
}

declare interface Font {
  family: string;
  id: string;
  category: Category;
  scripts: Script[];
  variants: Variant[];
  kind?: string;
  version?: string;
  lastModified?: string;
  files?: Record<Variant, string>;
}

declare module '*.vue' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
