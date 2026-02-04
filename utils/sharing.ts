
import { DashboardSpec, DashboardSpecSchema } from '../types';

/**
 * Encodes a DashboardSpec into a base64 string for URL sharing.
 */
export function encodeSpec(spec: DashboardSpec): string {
  const json = JSON.stringify(spec);
  // Using encodeURIComponent + btoa for UTF-8 support
  return btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) => 
    String.fromCharCode(parseInt(p1, 16))
  ));
}

/**
 * Decodes a base64 string back into a validated DashboardSpec.
 */
export function decodeSpec(encoded: string): DashboardSpec | null {
  try {
    const json = decodeURIComponent(Array.prototype.map.call(atob(encoded), (c) => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    const parsed = JSON.parse(json);
    return DashboardSpecSchema.parse(parsed);
  } catch (e) {
    console.error('Failed to decode spec from URL', e);
    return null;
  }
}

/**
 * Generates a shareable URL for the current specification.
 */
export function getShareableUrl(spec: DashboardSpec): string {
  const encoded = encodeSpec(spec);
  const url = new URL(window.location.href);
  url.searchParams.set('spec', encoded);
  return url.toString();
}
