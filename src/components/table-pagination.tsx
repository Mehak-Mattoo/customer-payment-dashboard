"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 30, 40, 50] as const;

interface TablePaginationProps {
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  className?: string;
}

export function TablePagination({
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  className,
}: TablePaginationProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const start = totalRows === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, totalRows);

  const handleSelect = (value: number) => {
    onRowsPerPageChange(value);
    onPageChange(1);
    setOpen(false);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center  justify-between gap-4 border-t border-gray-100 px-5 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-white/70",
        className
      )}
    >
      <p className="text-muted-foreground text-sm">
        {totalRows === 0 ? "0 of 0" : `${start}-${end} of ${totalRows}`}
      </p>
      <div className="flex items-center gap-4">
        <div ref={containerRef} className="relative flex  items-center gap-2">
          <span className="text-darkTextColor2  text-xs font-medium   tracking-wide">
            Rows per page:
          </span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center justify-between  bg-white gap-1 text-xs font-medium text-darkTextColor2 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label="Rows per page"
          >
            {rowsPerPage}
            <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", open && "rotate-180")} />
          </button>
          {open && (
            <div
              className="absolute left-23 top-5.5 z-50 mt-1 min-w-12 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
              role="listbox"
            >
              {ROWS_PER_PAGE_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  role="option"
                  aria-selected={rowsPerPage === n}
                  onClick={() => handleSelect(n)}
                  className={cn(
                    "mx-1 flex w-[calc(100%-0.55rem)] items-center justify-center rounded-lg py-1 text-sm font-medium transition-colors",
                    rowsPerPage === n
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-gray-100"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-5 w-6"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-darkTextColor2 min-w-[3ch] text-right text-xs font-medium">
            <span className="text-muted-foreground">{page}</span> /{totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-5 w-6"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
