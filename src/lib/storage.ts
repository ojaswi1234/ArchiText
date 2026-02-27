import { ArchitecturalDesignGenerationOutput } from "@/ai/flows/architectural-design-generation-flow";

export interface SavedArchitecture extends ArchitecturalDesignGenerationOutput {
  id: string;
  requirements: string;
  createdAt: string;
}

const STORAGE_KEY = 'architext_designs';

export function saveArchitecture(design: SavedArchitecture) {
  if (typeof window === 'undefined') return;
  const existing = getSavedArchitectures();
  const updated = [design, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getSavedArchitectures(): SavedArchitecture[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getArchitectureById(id: string): SavedArchitecture | undefined {
  return getSavedArchitectures().find(a => a.id === id);
}
