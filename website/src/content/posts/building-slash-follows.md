---
title: Building /follows
description: A page the highlights who's blogs I'm following
type: post
pubDate: 2024-03-29
tags: ['webdev']
draft: false
---

[I built out a `/follows` page that lists all the RSS feeds I'm subscribed too](/follows). Thankfully, Astro and Commafeed made this very easy to build out.
All I needed to do was: 
1. figure out how to programmatically pull out the blogs I follow from commafeed (my feed reader) 
2. pull the blogs I follow but into an Astro page and create a basic template to display it.  
3. git commit, do a lil pull request, merge into main, and wait for my deploy to Railway to finish.
4. Finished! 

> ℹ️ Note 
> 
> This was inspired by the follows page over on [Kevin Kipp's blog](https://kevinkipp.com/follows/) where he highlights all the blogs he follows via RSS.

## Pulling the data out of commafeed 

I self host an RSS feed reader called commafeed. When I started working on this I just sort of *assumed* they had an API and thankfully they did... It just wasn't a conventional REST API! It's something called a "fever" API.

Commafeed gives you an "API Url" but that's about it as far as documentation goes for it.

### What's a fever API?

I had absolutely 0 idea what a fever API was so I did a bit of searching. Turns out, once upon a time, there was a RSS feed aggregator called "fever" and their API spec seems to have become a defacto unwritten standard for interacting with a feed aggregator. 

On this wild gooes chase, I found a myriad of github pages, README's, and other applications documenting their own fever API integrations. In that mess of pages, [I found this](https://github.com/DigitalDJ/tinytinyrss-fever-plugin/blob/master/fever-api.md). It claims to include a complete copy of the API spec from fever's site (which is now timing out; making this a surviving copy of that lost info).

### Fever API Authentication 

It looks like to "authenticate" against a fever API, you have to put your username and password together in the format of `${user}:${pass}` then md5 hash them. You then POST   that string over in the body labelled as `api_key`. 

While this is definitely a weird user of the `POST` verb that's not too hard! Here's some code I used to verify I could authenticate in node.js 

```js
const crypto = await import('crypto')

// set username and API key from commafeed  
const username = "user"
const apiKey = "some-api-key-goes-here" // you can get this in your commafeed profile

// hash user and "password" together in an md5 hash 
const authStr = `${username}:${apiKey}`
const authHash = crypto.createHash('md5').update(authStr).digest('hex')

// make a call to the API 
const res = await fetch(`https://rss.tbx.sh/rest/fever/user/3?api_key=${authHash}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
const data = await res.json();

console.log(data);
/*
// here's what the response looks like 
{
  "api_version": 3,
  "auth": 1,
  "last_refreshed_on_time": 1711829713
}
// the auth being set to 1 means we are authenticated. 
*/
```

### Getting feeds from the Fever API

With authentication figured out, I had to figure out how to get some posts. Thankfully, the docs we have on hand make that pretty obvious as well. It seems all we had to do was slightly alter the URL in our code above from `https://rss.tbx.sh/rest/fever/user/3?api_key=${authHash}` to `https://rss.tbx.sh/rest/fever/user/3?api_key=${authHash}&feeds` aka just add `&feeds` to the end 😎 

It seems fever APIs mostly return objects based on the query parameters on the URL and usually all live at a singular "path". 


## Moving it to the blog

Awesome, so now we know how to authenticate and get feeds, let's move it into the blog.

- create a `follows.astro` page 
- copy-paste that code from above and adapt it to Astro
- add some types
- add some markup 

```astro
---
import crypto from 'node:crypto';
import Layout from "@components/layout/Layout.astro";

// types for the fever data 
type FeedResponse = {
  api_version: number,
  auth: 0 | 1,
  last_refreshed_on_time: number,
  feeds: Feed[],
  feed_groups: [
    {
      group_id: number,
      feeds: string
    }
  ]
}

type Feed = {
  id: number,
  favico_id: number,
  title: string,
  url: string,
  site_url: string,
  is_spark: number;
  last_updated_on_time: number;
}

const username = import.meta.env.RSS_USERNAME
const apiKey = import.meta.env.RSS_API_KEY;
const apiUrl = import.meta.env.RSS_API_URL;
const authStr = `${username}:${apiKey}`
const authHash = crypto.createHash('md5').update(authStr).digest('hex')

// make a call to the API 
const res = await fetch(`${apiUrl}?api_key=${authHash}&feeds`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
const data: FeedResponse = await res.json();

console.log(data);
---

<Layout title="Follows" description="the blogs I follow">
  <h1>Follows</h1>
  <p>Below are the blogs I'm currently following.</p>
  <ul>
  {data.feeds.map((feed: Feed) => {
    return (
      <li>
        <a href={feed.site_url}>{feed.title}</a>
      </li>
    )
  })}
  </ul>
</Layout>
```

### Cleaning up `site_url`'s

The `site_url` key in the feed object is *supposed* to reference a URL with human readable content (i.e a home or posts page). However, some of the feeds I follow just set their RSS url in this feed again. Since I want to use this link to point visitors to sites, I want to normalize these URLs. The easiest way I could think of doing this is just passing `site_url` int the `new URL()` constructor and returning the origin from the returned URL object. 


```astro
---
// getting the data up here

const cleanSiteUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.origin;
  } catch(err){
    return url
  }
}
---
<!-- some markup -->
<ul>
  {data.feeds.map((feed: Feed) => {
    return (
      <li>
        <a href={cleanSiteUrl(feed.site_url)}>{feed.title}</a>
      </li>
    )
  })}
</ul>
<!-- some other markup -->
```

### Adding favicons 

Now that I had some data on the page, I realized it would probably be nice to have each blog's favicon besides the name. Thankfully, the fever API exposes an endpoint to fetch all the favicons as well. 

In testing, it looks like the favicon endpoint returns all the favicons in a raw base64 string and takes around 5-6 seconds to return a response (yikes). With that in mind I 

- rewrote some of our data fetching to run in parallel.
  - This should speed things up cause it'll fetch both the feed and favicons at the same time instead of one after the other. 
- set the page up to use astro's prerendering feature. 
  - the page is built into a static files on the site's release instead of being server-rendered on each request. 
  - The main downside with this approach is that the data on the page will often be stale as it only pulls in new data on site build. My follows don't change much though so I'm okay with that.
- build out some types so I stop getting implicit any errors 

```astro
---
// this makes it so it only builds this page once
export const prerender = true

// imports go here 
// types for the fever data
type FeedResponse = {
  api_version: number;
  auth: 0 | 1;
  last_refreshed_on_time: number;
  feeds: Feed[];
  feed_groups: [
    {
      group_id: number;
      feeds: string;
    },
  ];
};

type FaviconResponse = {
  api_version: number;
  auth: 0 | 1;
  last_refreshed_on_time: number;
  favicons: Favicon[];
};

type Feed = {
  id: number;
  favicon_id: number;
  title: string;
  url: string;
  site_url: string;
  is_spark: number;
  last_updated_on_time: number;
};

type Favicon = {
  id: number;
  data: string;
};

// auth hash creation goes here 

// get feeds api
let feedData: FeedResponse | null = null;
let faviconData: FaviconResponse | null = null;

try {
  const feedRes = fetch(`${apiUrl}?api_key=${authHash}&feeds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const faviconRes = fetch(`${apiUrl}?api_key=${authHash}&favicons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  const results = await Promise.allSettled([feedRes, faviconRes]);
  
  if(results[0].status === 'rejected' || results[1].status === 'rejected') {
    throw new Error('failed to fetch feeds');
  }

  feedData = await results[0].value.json();
  faviconData = await results[1].value.json();
} catch (err) {
  console.error('failed to fetch feeds')
  console.error(err);
}

// clean site url function goes here
---

<Layout title="Follows" description="the blogs I follow">
  <h1>Follows</h1>
  <p>
    This page lists all of the blogs, newsletters, and peeps that I follow
    across the internet in my RSS feed aggregator. I <a
      href="/posts/building-slash-follows">wrote a post on how I built this</a
    > if you're interested.
  </p>
  <ul>
    { feedData != null && faviconData != null && 
      feedData.feeds.map((feed: Feed) => {
        return (
          <li>
            <img src={faviconData.favicons.find(({id}) => id === feed.favicon_id)?.data} />
            <a href={cleanSiteUrl(feed.site_url)}>{feed.title}</a>
          </li>
        );
      })
    }
  </ul>
</Layout>
```

With that, we've got the page pre-rendering once per build, got some types in place, and have favicon's beside the feed titles and links.

### Puttin' some paint on it

Right now the page is super basic. The images are huge, all my follows are just in a big boring list, so let's do some stuff to clean it up: 

- put follows in a 2-column grid layout.  
- cleanup the layout for each follow.
  - the image / title should be center aligned 
  - the images are appropriately sized
- use a little trick to make the whole area of the li element clickable as of it was an anchor tag 
  - can do this with a little `a:after` trick in the code below. 

```astro
---
// all the build logic and data fetching goes here
---
<Layout title="Follows" description="the blogs I follow">
  <ul>
    { feedData != null && faviconData != null && 
      feedData.feeds.map((feed: Feed) => {
        return (
          <li>
            <img src={faviconData.favicons.find(({id}) => id === feed.favicon_id)?.data} />
            <a href={cleanSiteUrl(feed.site_url)}>{feed.title}</a>
          </li>
        );
      })
    }
  </ul>
</Layout>

<style>
  ul {
    display: grid;
    list-style-type: none;
    grid-template-columns: 1fr 1fr;
    padding: 0;
  }
  li {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--size-2);
    padding: var(--size-1) var(--size-2);
    transform-origin: center;
    border: 1px solid rgba(0, 0, 0, 0);
    border-left: 1px solid var(--paper-3);
    transition:
      transform 0.2s ease,
      background 0.2s ease;
  }
  li:hover,
  li:focus-within {
    background: var(--paper-3);
    transform: scale(1.05);
    border: 1px solid var(--accent-1);
    z-index: var(--layer-5);
  }
  li img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  li a:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
```

With that, [we've got the page all put together](/follows) 🎉