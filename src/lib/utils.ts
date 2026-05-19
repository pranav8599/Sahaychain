import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncateAddress(address: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Automatically retries fetch requests for serverless/DB cold starts
export async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3, backoff = 2000): Promise<Response> {
  try {
    const res = await fetch(url, options);
    // Retry on 5xx errors (e.g. 504 Gateway Timeout during cold starts)
    if (!res.ok && res.status >= 500 && retries > 0) {
      console.warn(`Fetch failed with ${res.status}, retrying in ${backoff}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 1.5);
    }
    return res;
  } catch (error) {
    // Retry on network errors
    if (retries > 0) {
      console.warn(`Fetch error: ${error}. Retrying in ${backoff}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 1.5);
    }
    throw error;
  }
}
