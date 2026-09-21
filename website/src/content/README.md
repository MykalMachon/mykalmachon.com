# Content authoring

- Edit the About page in `pages/about-me.mdoc`.
- Blog posts live in `posts/` and may use either `.md` or `.mdoc`.
- Use `.mdoc` when a page or post needs one of the custom components below.

## Aside

```markdoc
{% aside type="note" title="Optional title" %}

Aside content supports **Markdown**.

{% /aside %}
```

Supported types are `note`, `tip`, and `warning`.

## Collapsible details

```markdoc
{% details title="More information" icon="mdi:information-outline" %}

- Detail one
- Detail two

{% /details %}
```

Icons use [Material Design Icons](https://icon-sets.iconify.design/mdi/).
