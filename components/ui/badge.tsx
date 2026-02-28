import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-[#d8f0df] px-3 py-1 text-xs font-medium text-[#198b3b]",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
