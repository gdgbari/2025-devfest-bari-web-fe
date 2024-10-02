declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"externals": {
"ar.md": {
	id: "ar.md";
  slug: "ar";
  body: string;
  collection: "externals";
  data: InferEntrySchema<"externals">
} & { render(): Render[".md"] };
"google.md": {
	id: "google.md";
  slug: "google";
  body: string;
  collection: "externals";
  data: InferEntrySchema<"externals">
} & { render(): Render[".md"] };
"jeba.md": {
	id: "jeba.md";
  slug: "jeba";
  body: string;
  collection: "externals";
  data: InferEntrySchema<"externals">
} & { render(): Render[".md"] };
"knime.md": {
	id: "knime.md";
  slug: "knime";
  body: string;
  collection: "externals";
  data: InferEntrySchema<"externals">
} & { render(): Render[".md"] };
"nextome.md": {
	id: "nextome.md";
  slug: "nextome";
  body: string;
  collection: "externals";
  data: InferEntrySchema<"externals">
} & { render(): Render[".md"] };
"wideverse.md": {
	id: "wideverse.md";
  slug: "wideverse";
  body: string;
  collection: "externals";
  data: InferEntrySchema<"externals">
} & { render(): Render[".md"] };
};
"sessions": {
"deep_dive_flutter.md": {
	id: "deep_dive_flutter.md";
  slug: "deep_dive_flutter";
  body: string;
  collection: "sessions";
  data: InferEntrySchema<"sessions">
} & { render(): Render[".md"] };
"flutter_1.md": {
	id: "flutter_1.md";
  slug: "flutter_1";
  body: string;
  collection: "sessions";
  data: InferEntrySchema<"sessions">
} & { render(): Render[".md"] };
"flutter_2.md": {
	id: "flutter_2.md";
  slug: "flutter_2";
  body: string;
  collection: "sessions";
  data: InferEntrySchema<"sessions">
} & { render(): Render[".md"] };
};
"speakers": {
"simone_bonfrate.md": {
	id: "simone_bonfrate.md";
  slug: "simone_bonfrate";
  body: string;
  collection: "speakers";
  data: InferEntrySchema<"speakers">
} & { render(): Render[".md"] };
};
"staff": {
"anna.md": {
	id: "anna.md";
  slug: "anna";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
"domingo.md": {
	id: "domingo.md";
  slug: "domingo";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
"emilia.md": {
	id: "emilia.md";
  slug: "emilia";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
"federica.md": {
	id: "federica.md";
  slug: "federica";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
"federico.md": {
	id: "federico.md";
  slug: "federico";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
"laura.md": {
	id: "laura.md";
  slug: "laura";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
"michela.md": {
	id: "michela.md";
  slug: "michela";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
"mike.md": {
	id: "mike.md";
  slug: "mike";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
"paolo.md": {
	id: "paolo.md";
  slug: "paolo";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
"pierantonio.md": {
	id: "pierantonio.md";
  slug: "pierantonio";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
"piernicola.md": {
	id: "piernicola.md";
  slug: "piernicola";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
"raffaele.md": {
	id: "raffaele.md";
  slug: "raffaele";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
"simone.md": {
	id: "simone.md";
  slug: "simone";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
"vito.md": {
	id: "vito.md";
  slug: "vito";
  body: string;
  collection: "staff";
  data: InferEntrySchema<"staff">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
