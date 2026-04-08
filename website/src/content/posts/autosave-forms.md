---
title: "Autosave on the Web"
customSlug: "autosave-on-the-web"
type: 'post'
description: "Using native browser APIs to autosave HTML forms"
pubDate: 2022-02-15
heroImage: '../../assets/posts/autosave-forms.avif'
tags: ['webdev']
draft: false

---

Forms on the web are awesome:

They're one of the first instances of web interactivity. Before we had Jquery, JavaScript, or Flash, we had forms, and post requests.

> Forms walked, so 1.2MB JavaScript bundles could run
>
> _Mykal Machon, 2022_

Forms are 100% native to the web and are a tried-and-true way to collect input from users: whether you stick to the originally intended POST-data-to-action on submit, or something javascript _enhanced_ like submitting the data via fetch, they sort of _just work_.

That said, forms don't have all the bells and whistles out of the box,
_One of those missing bells and whistles is autosave_

## Do we need Autosave, though?

Well, not always!

Until recently, it hadn't occurred to me that you really would need autosave in your forms; there are many other ways to persist user input.

To name a few:

1. Write user data to a database in real-time: similar to how apps like Notion, or Google docs handle things.
2. Keep forms short: users shouldn't spend a significant amount of time filling a form out

And those seem like valid, wholistic strategies until you think about:

### Working Offline

I'm working on a web app for one of my consulting partners. The app is typically used on phones in locations with _less than ideal_ wireless connections.

Picture this:

- You're working on-site, filling out a web-based inspection form.
- You fill out a few inputs, but you lose signal halfway through; you don't notice.
- You open your phone 5 minutes later and notice that your browser has reloaded the page in the background.
- You just lost all the data in your form! 😔

Admittedly I never even considered this when building the app. I just assumed the best. In cases like these, autosave can be a lifesaver!

## Solving Autosave!

Luckily, browsers and modern JavaScript make autosave pretty easy to implement 🥳

The solution I ended up going with uses something called [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API): which is a fancy key-value database, that's designed to be very fast, with lots of data.

I created a little NPM package called [FormStore](https://github.com/MykalMachon/FormStore) to make it easy!

> Hey 👋🏻
>
> I'm working on a more technical walk-through of this now; I just wanted to get my thought process out first.
> If you're seeing this and read the whole way through, thanks!
