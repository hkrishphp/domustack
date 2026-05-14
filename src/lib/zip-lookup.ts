// Free US ZIP → city/state lookup via api.zippopotam.us.
// No API key required. Endpoint shape:
//   https://api.zippopotam.us/us/78701
//   { "places": [{ "place name": "Austin", "state abbreviation": "TX" }] }

export type ZipLookupResult = { city: string; state: string };

const cache = new Map<string, ZipLookupResult | null>();

export async function lookupZip(zip: string): Promise<ZipLookupResult | null> {
  const clean = zip.trim().slice(0, 5);
  if (!/^\d{5}$/.test(clean)) return null;

  if (cache.has(clean)) return cache.get(clean) ?? null;

  try {
    const res = await fetch(`https://api.zippopotam.us/us/${clean}`);
    if (!res.ok) {
      cache.set(clean, null);
      return null;
    }
    const data = await res.json();
    const place = data?.places?.[0];
    if (!place) {
      cache.set(clean, null);
      return null;
    }
    const result: ZipLookupResult = {
      city: place["place name"] || "",
      state: place["state abbreviation"] || "",
    };
    cache.set(clean, result);
    return result;
  } catch {
    cache.set(clean, null);
    return null;
  }
}
