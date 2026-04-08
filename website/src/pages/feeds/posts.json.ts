import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import MarkdownIt from 'markdown-it'

const parser = new MarkdownIt();

const getPostData = async (site: string) => {
  const allPosts = await getCollection('posts', ({ data }) => data.draft !== true);
  return allPosts.map((post) => ({
    id: post.id,
    url: `${site}posts/${post.id}`,
    meta: {
      ...post.data,
    },
    content: {
      md: post.body,
      html: parser.render(post.body).replace(/\n/g, '')
    }
  })).sort((a, b) => a.meta.pubDate > b.meta.pubDate ? -1 : 1);
};

export const GET = async ({ site }: APIContext) => {
  const postData = await getPostData(site?.toString() || 'https://mykal.codes/');
  return new Response(JSON.stringify(postData), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*', // enable other clients to grab the data
    }
  });
}