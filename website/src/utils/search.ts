import MiniSearch from 'minisearch';

export type FeedPost = {
  id: string;
  url: string;
  meta: {
    title: string;
    pubDate: string;
    tags: string[];
    description: string;
  };
  content: { md: string };
};

export const createPostSearch = (posts: FeedPost[]) => {
  const index = new MiniSearch({
    fields: ['title', 'tags', 'description', 'text'],
    storeFields: ['title', 'tags', 'description', 'date', 'url'],
  });

  index.addAll(posts.map((post) => ({
    id: post.id,
    url: post.url,
    title: post.meta.title,
    date: post.meta.pubDate,
    tags: post.meta.tags,
    description: post.meta.description,
    text: post.content.md,
  })));

  return index;
};
