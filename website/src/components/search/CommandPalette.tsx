import { useEffect, useMemo, useRef, useState } from 'react';
import MiniSearch from 'minisearch';
import { createPostSearch, type FeedPost } from '@utils/search';

type Item = {
  title: string;
  description: string;
  url: string;
  kind: 'Navigate' | 'Social' | 'Search result';
};

const commands: Item[] = [
  { title: 'Home', description: 'Go to the homepage', url: '/', kind: 'Navigate' },
  { title: 'Posts', description: 'Browse all posts', url: '/posts', kind: 'Navigate' },
  { title: 'About', description: 'Learn more about me', url: '/about-me', kind: 'Navigate' },
  { title: 'Tags', description: 'Browse posts by tag', url: '/tags', kind: 'Navigate' },
  { title: 'Feeds', description: 'Subscribe via RSS or JSON', url: '/feeds', kind: 'Navigate' },
  { title: 'Contact', description: 'Get in touch', url: '/contact', kind: 'Navigate' },
  { title: 'GitHub', description: 'View my open-source work', url: 'https://github.com/MykalMachon', kind: 'Social' },
  { title: 'Bluesky', description: 'Read short posts and rants', url: 'https://bsky.app/profile/mykal.codes/', kind: 'Social' },
  { title: 'LinkedIn', description: 'View my career profile', url: 'https://www.linkedin.com/in/mykalmachon/', kind: 'Social' },
];

export default function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchIndex = useRef<MiniSearch | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchReady, setSearchReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch('/feeds/posts.json')
      .then((response) => response.ok ? response.json() : Promise.reject(response))
      .then((posts: FeedPost[]) => {
        searchIndex.current = createPostSearch(posts);
        setSearchReady(true);
      })
      .catch(() => setSearchReady(true));
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };
    const triggers = document.querySelectorAll('[data-command-palette-trigger]');
    const openPalette = () => setOpen(true);

    window.addEventListener('keydown', handleShortcut);
    triggers.forEach((trigger) => trigger.addEventListener('click', openPalette));
    return () => {
      window.removeEventListener('keydown', handleShortcut);
      triggers.forEach((trigger) => trigger.removeEventListener('click', openPalette));
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  const commandResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return commands;
    return commands.filter((command) =>
      `${command.title} ${command.description}`.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const postResults = useMemo<Item[]>(() => {
    if (!query.trim() || !searchIndex.current) return [];
    return searchIndex.current.search(query).slice(0, 8).map((result) => ({
      title: String(result.title),
      description: String(result.description || 'Post'),
      url: String(result.url),
      kind: 'Search result',
    }));
  }, [query, searchReady]);

  const results = [...commandResults, ...postResults];
  const navigate = (url: string) => { window.location.href = url; };

  useEffect(() => setActiveIndex(0), [query, searchReady]);

  return (
    <dialog
      className="command-palette"
      ref={dialogRef}
      onClose={() => setOpen(false)}
      onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
    >
      <form method="dialog" className="command-palette__form" onSubmit={(event) => {
        event.preventDefault();
        if (results[activeIndex]) navigate(results[activeIndex].url);
      }}>
        <label className="visually-hidden" htmlFor="command-palette-input">Search the site or navigate</label>
        <input
          ref={inputRef}
          id="command-palette-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && results.length > 0) {
              event.preventDefault();
              setActiveIndex((index) => Math.min(index + 1, results.length - 1));
            }
            if (event.key === 'ArrowUp' && results.length > 0) {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            }
          }}
          aria-activedescendant={results[activeIndex] ? `command-result-${activeIndex}` : undefined}
          placeholder="Search posts or navigate..."
        />
        <kbd>Esc</kbd>
      </form>
      <div className="command-palette__results">
        {!searchReady && <p>Loading search…</p>}
        {results.map((result, index) => (
          <button
            type="button"
            id={`command-result-${index}`}
            className={index === activeIndex ? 'is-active' : undefined}
            key={`${result.kind}-${result.url}`}
            onMouseMove={() => setActiveIndex(index)}
            onClick={() => navigate(result.url)}
          >
            <span>{result.title}</span>
            <small>{result.kind} · {result.description}</small>
          </button>
        ))}
        {searchReady && results.length === 0 && <p>No results found.</p>}
      </div>
      <p className="command-palette__hint">Search posts, pages, and social links. Press <kbd>⌘K</kbd> or <kbd>Ctrl K</kbd> to open.</p>
    </dialog>
  );
}
