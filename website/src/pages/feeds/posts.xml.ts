import rss from "@astrojs/rss";
import { getCollection, type CollectionEntry } from "astro:content";
import MarkdownIt from "markdown-it";

const parser = new MarkdownIt();

const getAdditionalHTML = (post: CollectionEntry<'posts'>) => {
  return `<hr /> 
    <p>
      Thanks for reading this post in your RSS reader! <br />
      If you want to respond you can 
      <a href="mailto:hello@mykal.codes">write me an Email</a> or reach
      out on <a href="https://indieweb.social/@mykalmachon">Mastodon</a>.
    </p>
    <p>
      <a href="${import.meta.env.SITE}/posts/${post.id}">
        Read the full post on the site
      </a>
    </p>
  `
}

const getPostData = async () => {
  const allPosts = await getCollection('posts', ({ data }) => data.draft !== true);
  const allPostsSorted = allPosts.sort((a, b) => a.data.pubDate > b.data.pubDate ? -1 : 1);
  const allPostsSortedRss = allPostsSorted.map((post) => ({
    title: post.data.title,
    description: `${parser.render(post.body).replace(/\n/g, '')} ${getAdditionalHTML(post)}`,
    pubDate: post.data.pubDate,
    link: `${import.meta.env.SITE}/posts/${post.id}`,
  }));
  return allPostsSortedRss;
}

export const GET = async () => {
  return rss({
    title: `Mykal Machon - Blog`,
    description: `Hey! I'm Mykal. Welcome to my blog's RSS feed. This contains all my posts, photos, notes, etc.`,
    site: import.meta.env.SITE,
    customData: `<language>en-us</language>`,
    items: await Promise.all(await getPostData())
  })
};
