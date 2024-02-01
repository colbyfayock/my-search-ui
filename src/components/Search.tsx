import { useState, useEffect, useRef } from 'react';

import useSearch from '@/hooks/use-search';

const Search = () => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [posts, setPosts] = useState();
  const { query, results, search, reset } = useSearch({ posts, maxResults: 5 });
  
  const hasResults = results && results.length > 0;

  useEffect(() => {
    (async function run() {
      const { posts: data } = await fetch('/posts.json').then(r => r.json());
      setPosts(data);
    })()
  }, []);

  function handleOnClick(event: MouseEvent) {
    // Look for the form in the path of elements starting at
    // the element that was clicked and look for the form.
    // If the form is found, that means someone's clicking
    // inside the search area
    if ( formRef.current && !event.composedPath().includes(formRef.current) ) {
      reset();
    }
  }

  function handleOnKeyDown(event: KeyboardEvent) {
    // If someone hits the escape key, we want to reset!
    if ( event.keyCode === 27 || event.code === 'Escape' ) {
      reset();
    }
  }

  useEffect(() => {
    if ( !hasResults ) return;
    document.body.addEventListener('click', handleOnClick);
    document.body.addEventListener('keydown', handleOnKeyDown);
    return () => {
      // Be sure to clean up event listeners when the
      // component unmounts
      document.body.removeEventListener('click', handleOnClick);
      document.body.removeEventListener('keydown', handleOnKeyDown);
    }
  }, [hasResults])

  return (
    <form ref={formRef} action="/search" className="relative">
      <label className="sr-only" htmlFor="search-query">
        Search Query
      </label>
      <input
        id="search-query"
        type="search"
        name="q"
        value={query || ''}
        onChange={(event) => search(event.currentTarget.value)}
        autoComplete="off"
        aria-label="Enter your search query"
        placeholder="Search..."
        required
      />
      {query && (
        <div className="absolute top-[calc(100%_+_1px)] right-0 w-96 bg-white border border-zinc-200 p-3">
          {Array.isArray(results) && results.length > 0 && (
            <ul>
              {results.map(({ url, title }, index) => {
                return (
                  <li key={url} className="mb-1 last:mb-0">
                    <a className="block hover:text-blue-500 outline-2 outline-blue-500 px-2 py-1" href={url} rel="noopener">
                      {title}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
          {query && Array.isArray(results) && results.length === 0 && (
            <p>
              Sorry, not finding anything for <strong>{query}</strong>
            </p>
          )}
        </div>
      )}
      
    </form>
  )
}

export default Search;