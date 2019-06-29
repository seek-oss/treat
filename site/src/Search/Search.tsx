import React, { useState, useCallback, ChangeEvent } from 'react';
import { HashLink } from 'react-router-hash-link';

import { search, SearchResult as SearchResultType } from './search-client';
import { Box } from '../system';
import Text from '../Typography/Text';

const SearchResult = ({ route, hash, breadcrumbs }: SearchResultType) => {
  return (
    <HashLink
      to={{
        pathname: route,
        hash,
      }}
    >
      <Box>
        <Text weight="strong">{breadcrumbs[0]}</Text>
        {breadcrumbs.slice(1).map(crumb => (
          <Text key={crumb}>> {crumb}</Text>
        ))}
      </Box>
      <hr />
    </HashLink>
  );
};

export default () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value),
    [setSearchTerm],
  );

  const results = searchTerm ? search(searchTerm) : [];

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleChange} />
      {results.length
        ? results.map(result => (
            <SearchResult key={result.route + result.hash} {...result} />
          ))
        : null}
    </div>
  );
};
