import { component, defineMarkdocConfig } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    aside: {
      render: component('./src/components/content/Aside.astro'),
      attributes: {
        type: { type: String, default: 'note' },
        title: { type: String },
      },
    },
    details: {
      render: component('./src/components/content/Details.astro'),
      attributes: {
        title: { type: String, required: true },
        icon: { type: String },
      },
    },
  },
});
