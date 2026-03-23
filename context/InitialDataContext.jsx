import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Initial data context for SSR hydration of pages (e.g., product detail)
// Provides initialProduct to render full HTML on the server before client hydration.

const InitialDataContext = createContext({
  initialProduct: null,
  setInitialProduct: () => {},
  initialCategoryLvl4: null,
  setInitialCategoryLvl4: () => {},
});

export const InitialDataProvider = ({
  children,
  initialProduct: providedInitialProduct = null,
  initialCategoryLvl4: providedInitialCategoryLvl4 = null,
}) => {
  const [initialProduct, setInitialProduct] = useState(providedInitialProduct);
  const [initialCategoryLvl4, setInitialCategoryLvl4] = useState(
    providedInitialCategoryLvl4,
  );

  // On client, if not provided by SSR props, pick up window.__INITIAL_DATA__ once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (initialProduct) return;
    const payload = window.__INITIAL_DATA__;
    if (payload) {
      if (!initialProduct && payload.product) {
        setInitialProduct(payload.product);
      }
      if (!initialCategoryLvl4 && payload.categoryLvl4) {
        setInitialCategoryLvl4(payload.categoryLvl4);
      }
      try {
        // Avoid reusing stale data on client-side navigations
        delete window.__INITIAL_DATA__;
      } catch (_) {}
    }
  }, [initialProduct, initialCategoryLvl4]);

  const value = useMemo(
    () => ({
      initialProduct,
      setInitialProduct,
      initialCategoryLvl4,
      setInitialCategoryLvl4,
    }),
    [initialProduct, initialCategoryLvl4],
  );

  return (
    <InitialDataContext.Provider value={value}>
      {children}
    </InitialDataContext.Provider>
  );
};

export const useInitialData = () => useContext(InitialDataContext);

export default InitialDataContext;
