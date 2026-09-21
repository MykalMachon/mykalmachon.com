import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdoc", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdoc}", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.coerce.date(),
      type: z.enum(["post", "photo", "note", "link"]),
      draft: z.boolean(),
      tags: z.optional(z.array(z.string())),
      stage: z.optional(z.enum(["seed", "budding", "sapling", "old growth"])),
      description: z.optional(z.string()),
      heroImage: z.optional(image()),
      location: z.optional(z.string()),
      photos: z.optional(
        z.array(
          z.object({
            url: z.url(),
            alt: z.string(),
          }),
        ),
      ),
      url: z.optional(z.url()),
    }),
});

export const collections = {
  pages,
  posts,
};
