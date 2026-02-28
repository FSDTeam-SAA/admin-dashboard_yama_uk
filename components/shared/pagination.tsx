"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (nextPage: number) => void;
};

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const compactPages = pages.reduce<number[]>((acc, value) => {
    if (acc.length === 0) return [value];
    const last = acc[acc.length - 1];
    if (value - last > 1) acc.push(-1);
    acc.push(value);
    return acc;
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      {compactPages.map((p, idx) =>
        p === -1 ? (
          <Button key={`dot-${idx}`} variant="outline" size="icon" disabled>
            ...
          </Button>
        ) : (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="icon"
            onClick={() => onChange(p)}
          >
            {p}
          </Button>
        ),
      )}
      <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
