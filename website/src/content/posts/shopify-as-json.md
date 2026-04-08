---
title: "Get any Shopify product as JSON"
type: 'post'
customSlug: "shopify-as-json"
description: "If you ever need to pull Shopify product info, this tip will be a huge help."
pubDate: 2022-07-19
heroImage: '../../assets/posts/shopify-as-json.avif'
draft: false
tags: ['webdev']
---

I found out that you could get any Shopify product as JSON/XML way too late in my Shopify development game. If there is a public URL for the Shopify product, and the store is using the standard Shopify theme engine, you can grab all the public details as JSON at any time with a quick URL trick.

All you have to do is add `.json` to the end of the product URL, and it will return the JSON file representation of the object; for XML just add the `.xml` to the end.

## Getting product info in Javascript

Here's a quick demo of how you'd grab a product's info as JSON in Javascript. All you're going to need is the URL where you can find the product, and some way of running javascript (browser, or node.js with `node-fetch`).

Let's use a product from the Allbirds store:

```js
// product url
const productUrl =
  "https://www.allbirds.com/products/mens-tree-flyers-blizzard";

// function to grab the data and return a promise
const getProductData = async (productUrl) => {
  const productUrlJSON = `${productUrl}.json`;
  const response = await fetch(productUrlJSON);
  const data = await response.json();
  return data;
};

// get the data and then log it, or do whatever!
getProductData(productUrl).then((data) => {
  console.log(data);
});
```

This should log something like this to your console:

```json
{
    {
    "product": {
        "id": 6673825890384,
        "title": "Men's Tree Flyers - Blizzard (Blizzard Sole)",
        "body_html": "<p>The Allbirds Tree Flyers for men are a lightweight, springy distance running shoe—including our new SwiftFoam™ midsole, made of natural and recycled materials. </p>",
        "vendor": "Allbirds",
        "product_type": "Shoes",
        "created_at": "2022-04-20T14:39:25-07:00",
        "handle": "mens-tree-flyers-blizzard",
        "updated_at": "2022-07-19T12:20:43-07:00",
        "published_at": "2022-05-15T18:56:08-07:00",
        "template_suffix": "mens-tree-flyers",
        "published_scope": "global",
        "tags": "allbirds::cfId => color-mens-tree-flyers-blizzard-blizzard, allbirds::complete => true, allbirds::edition => limited, allbirds::gender => mens, allbirds::hue => white, allbirds::master => mens-tree-flyers, allbirds::material => tree, allbirds::silhouette => dasher, loop::returnable => true, shoprunner, YCRF_mens-perform-shoes, YGroup_ygroup_mens-tree-flyers",
        "variants": [],
        "options": [],
        "images": [],
        "image": {
            "id": 30031923576912,
            "product_id": 6673825890384,
            "position": 1,
            "created_at": "2022-06-02T15:17:26-07:00",
            "updated_at": "2022-06-02T15:17:26-07:00",
            "alt": null,
            "width": 1600,
            "height": 1600,
            "src": "https://cdn.shopify.com/s/files/1/1104/4168/products/AA001NM_SHOE_ANGLE_GLOBAL_MENS_TREE_FLYER_BLIZZARD_BLIZZARD_91a3e1d2-f0d0-4649-a8e8-0d556a1a4e51.png?v=1654208246",
            "variant_ids": []
        }
    }
}
}
```

From here, you can do whatever you need with that data, including:

- custom CTAs/cards for the product.
- custom landing pages for the product on marketing sites.
- simple external product inventories via the sitemap.
- lots of other things...

Speaking of, if you've used this API for other weird things, feel free to comment down below with examples. I would love to see what elese people are using these for.
