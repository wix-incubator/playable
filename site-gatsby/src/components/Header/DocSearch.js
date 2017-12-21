import React, { Component } from 'react';
import docSearch from 'docsearch.js';
import 'docsearch.js/dist/npm/styles/main.scss';

class DocSearch extends Component {
  componentDidMount() {
    docSearch({
      apiKey: '8b7e07f448cec6e39fa301bf82ac83d6',
      indexName: 'wix',
      inputSelector: '#input-search-custom',
      debug: false, // Set debug to true if you want to inspect the dropdown
    });
  }

  render() {
    return (
      <div className="search">
        <input
          type="text"
          className="search"
          id="input-search-custom"
          placeholder="Search"
        />
      </div>
    );
  }
}

export default DocSearch;
