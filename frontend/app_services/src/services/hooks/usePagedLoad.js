import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "../../utils/constants";

export const usePagedLoad = ({ data, pageSize = DEFAULT_PAGE_SIZE }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const observer = useRef();
  const safeData = Array.isArray(data) ? data : [];
  const totalItemsCount = safeData.length;
  const totalPages = Math.ceil(totalItemsCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedData = useMemo(
    () => safeData.slice(startIndex, endIndex),
    [safeData, startIndex, endIndex],
  );
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const observeIntersection = useCallback(() => {}, []);

  const goToPage = useCallback(
    (page) => {
      if (!totalPages) return;
      const nextPage = Math.min(Math.max(page, 1), totalPages);
      setCurrentPage(nextPage);
    },
    [totalPages],
  );

  const goToNextPage = useCallback(() => {
    if (!canGoNext) return;
    setCurrentPage((prevPage) => prevPage + 1);
  }, [canGoNext]);

  const goToPrevPage = useCallback(() => {
    if (!canGoPrev) return;
    setCurrentPage((prevPage) => prevPage - 1);
  }, [canGoPrev]);

  useEffect(() => {
    setCurrentPage(1);
  }, [safeData, pageSize]);

  useEffect(() => () => observer.current?.disconnect(), []);

  return {
    canGoNext,
    canGoPrev,
    currentPage,
    goToNextPage,
    goToPage,
    goToPrevPage,
    loadedItemsCount: paginatedData.length,
    observeIntersection,
    paginatedData,
    totalItemsCount,
    totalPages,
  };
};

export default usePagedLoad;
