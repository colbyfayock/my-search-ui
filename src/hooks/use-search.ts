import { useState } from 'react';
import uFuzzy from '@leeoniya/ufuzzy';

import type { Post } from '@/types/post';

export default function useSearch({ posts, maxResults }: { posts?: Array<Post>; maxResults?: number; }) {
  const [query, setQuery] = useState<string>();
  
  let results;
  
  if ( typeof query === 'string' && Array.isArray(posts) ) {
    results = searchPosts(query, posts);
  }

  if ( results && typeof maxResults === 'number' ) {
    results = results?.splice(0, maxResults);
  }

  return {
    query,
    results,
    search: setQuery,
    reset: () => setQuery(undefined)
  }
}

function searchPosts(query: string, posts: Array<Post>) {
  // Format to an array of strings for uFuzzy to understand

  const haystack = posts?.map(post => [post.title, post.categories.join(' ')].join(' | '));

  const u = new uFuzzy();

  const idxs = u.filter(haystack, query);

  if ( !idxs ) return;

  const info = u.info(idxs, haystack, query);
  const order = u.sort(info, haystack, query);
  
  return order.map(index => posts[info.idx[order[index]]]);
}