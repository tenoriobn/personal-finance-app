export function usePagination(currentPage: number, totalPages: number, maxButtons = 4): number[] {
  const pages: number[] = [];

  if (totalPages <= maxButtons) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  }
  else {
    let start = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
    let end = start + maxButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = end - maxButtons + 1;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }

  return pages;
}
