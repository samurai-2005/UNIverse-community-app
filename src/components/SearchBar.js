import React from "react";
import "../styles/SearchBar.css";

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search communities, users..." />
    </div>
  );
};

export default SearchBar;
