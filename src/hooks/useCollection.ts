import { useCallback, useEffect, useState } from "react";
import type { Tool } from "../types";

const KEY = "ai-scout-collection";

function load(): Tool[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Tool[]) : [];
  } catch {
    return [];
  }
}

export interface Collection {
  items: Tool[];
  has: (id: string) => boolean;
  add: (tool: Tool) => void;
  remove: (id: string) => void;
  toggle: (tool: Tool) => void;
}

/**
 * A persistent group of tools ("My toolkit") kept in localStorage so it
 * survives reloads and sessions.
 */
export function useCollection(): Collection {
  const [items, setItems] = useState<Tool[]>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const has = useCallback((id: string) => items.some((t) => t.id === id), [items]);

  const add = useCallback((tool: Tool) => {
    setItems((prev) => (prev.some((t) => t.id === tool.id) ? prev : [...prev, tool]));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggle = useCallback((tool: Tool) => {
    setItems((prev) =>
      prev.some((t) => t.id === tool.id)
        ? prev.filter((t) => t.id !== tool.id)
        : [...prev, tool],
    );
  }, []);

  return { items, has, add, remove, toggle };
}
