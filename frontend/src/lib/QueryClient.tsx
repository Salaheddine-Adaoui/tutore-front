"use client";

import dynamic from "next/dynamic";
import { ComponentType, PropsWithChildren } from "react";
import QueryProvider from "@/lib/QueryProvider";

/* generic factory */
export function withQueryClient<T extends object>(
  importer: () => Promise<{ default: ComponentType<T> }>
) {
  // options **must be** a literal
  const Inner = dynamic(importer, { ssr: false });

  return function Wrapped(props: PropsWithChildren<T>) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <QueryProvider>
        <Inner {...(props as T)} />
      </QueryProvider>
    );
  };
}

/* concrete instance */
export const Scraper = withQueryClient(
  () => import("@/components/Test/scraper")   // <── exact path / casing
);
