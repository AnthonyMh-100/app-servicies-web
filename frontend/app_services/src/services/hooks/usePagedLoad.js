import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "../../utils/constants";

export const usePagedLoad = ({ data, pageSize = DEFAULT_PAGE_SIZE }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const observer = useRef();

  const paginatedData = useMemo(
    () => data.slice(0, (currentPage + 1) * pageSize),
    [currentPage, data, pageSize],
  );

  const observeIntersection = useCallback((node) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [data]);

  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  return {
    currentPage,
    observeIntersection,
    paginatedData,
  };
};

export default usePagedLoad;
