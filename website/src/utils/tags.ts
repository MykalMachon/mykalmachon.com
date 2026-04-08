import type { CollectionEntry } from "astro:content";

export type TagCount = Record<string, number>;

const formatTagString = (tag: string): string => {
  return tag.trim().toLowerCase();
};

export const getTagCount = (posts: CollectionEntry<"posts">[]) => {
  return posts
    .map((post) => post.data.tags)
    .reduce<TagCount>((accTags, postsTags) => {
      if (postsTags != undefined) {
        postsTags.forEach((tag) => {
          const tagf = formatTagString(tag);
          accTags[tagf] = accTags[tagf] !== undefined ? accTags[tagf] + 1 : 1;
        });
      }
      return accTags;
    }, {});
};
