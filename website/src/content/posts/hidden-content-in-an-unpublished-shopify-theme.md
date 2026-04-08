---
title: 'Previewing hidden content in an unpublished Shopify theme'
customSlug: 'hidden-content-in-an-unpublished-shopify-theme'
type: 'post'
description: 'When you want to preview a hidden product/post on a hidden theme things get tricky.'
pubDate: 2020-07-08
draft: false
tags: ['webdev']

---

## The Issue

You're working on a brand new product for your Shopify store, it's set to unavailable and you & the team are working on a launch for it later this month.You're also working on a new theme that will launch alongside your product, **how are you supposed to see how that new product looks with your new theme?**

You can preview the new product, but it opens in the published theme, not the new theme you're working on...

**So do you have to make your new product available and just hope no one notices?** 😥

## The Solution

Thankfully, there's a way we can get around this!

1. Open your Shopify admin to your hidden product, and click "Preview" at the top of the page
2. From the product's preview page, copy the part of the URL that looks like this: `/products_preview?preview_key=your_key_goes_here`
3. In a new tab, open the new theme you're working on as a preview as well.
4. In the URL bar, paste the portion of the product URL we copied earlier. your new URL should look something like this `https://mystore.com/products_preview?preview_key=your_key_goes_here`.
5. Hit enter and you should be able to preview your hidden product in your new theme ✨🎉

## Not just for Products

This will work for hidden pages, and articles as well! Which is great when you're working on a landing page or a fancy new blog template!

This has been a huge pain for me when working on themes, and I just recently found this quick fix so I thought I'd share! Hopefully it helped you as well.
