import React, { createContext, useState, useContext } from "react";

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategoryLvl4Id, setSearchCategoryLvl4Id] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [prevRoute, setPrevRoute] = useState("");

  const startSearch = (fromPath) => {
    if (!isSearching) {
      setPrevRoute(fromPath || "");
      setIsSearching(true);
    }
  };

  const endSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
    setSearchCategoryLvl4Id(null);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchCategoryLvl4Id,
        setSearchCategoryLvl4Id,
        isSearching,
        prevRoute,
        startSearch,
        endSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
