import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Kontraio Supabase client.
 * Uses service_role key to bypass RLS — ONLY use in server components.
 */
export function createKontraioClient() {
  return createClient(
    process.env.KONTRAIO_SUPABASE_URL!,
    process.env.KONTRAIO_SERVICE_ROLE_KEY!
  );
}

// Types matching Kontraio's database schema
export type KontraioCompany = {
  id: string;
  name: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  logo_url: string | null;
  email: string | null;
  website: string | null;
  street_address: string | null;
  zip: string | null;
  contractor_license_number: string | null;
  license_state: string | null;
  created_at: string;
};

export type KontraioProfile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  job_title: string | null;
};

export type KontraioCatalogItem = {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  item_type: string | null;
};

export type KontraioService = {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  sort_order: number;
};

/**
 * Fetch the master services list from Kontraio.
 */
export async function fetchKontraioServices(): Promise<KontraioService[]> {
  const kontraio = createKontraioClient();
  const { data, error } = await kontraio
    .from("services")
    .select("id, name, slug, icon_name, sort_order")
    .order("sort_order");

  if (error || !data) return [];
  return data as KontraioService[];
}

// Service area types
export type KontraioServiceAreasByCity = {
  city: string;
  state: string;
  zip_codes: string[];
};

/**
 * Fetch service areas for a company, grouped by city.
 */
export async function fetchKontraioServiceAreas(
  companyId: string
): Promise<KontraioServiceAreasByCity[]> {
  const kontraio = createKontraioClient();
  const { data, error } = await kontraio
    .from("company_service_areas")
    .select("zip_code, city, state")
    .eq("company_id", companyId)
    .order("city");

  if (error || !data) return [];

  const grouped = new Map<string, KontraioServiceAreasByCity>();
  for (const row of data as { zip_code: string; city: string; state: string }[]) {
    const key = `${row.city}|${row.state}`;
    if (!grouped.has(key)) {
      grouped.set(key, { city: row.city, state: row.state, zip_codes: [] });
    }
    grouped.get(key)!.zip_codes.push(row.zip_code);
  }

  return Array.from(grouped.values());
}

/**
 * Fetch flat list of zip codes a company serves (for filtering).
 */
export async function fetchKontraioServiceAreaZips(
  companyId: string
): Promise<string[]> {
  const kontraio = createKontraioClient();
  const { data } = await kontraio
    .from("company_service_areas")
    .select("zip_code")
    .eq("company_id", companyId);

  return (data ?? []).map((r: { zip_code: string }) => r.zip_code);
}

/**
 * Resolve a Domustack user email to a Kontraio company ID.
 * Looks up the email in Kontraio profiles, then finds their company membership.
 */
export async function fetchKontraioCompanyByEmail(
  email: string
): Promise<string | null> {
  const kontraio = createKontraioClient();

  const { data: profile } = await kontraio
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (!profile) return null;

  const { data: member } = await kontraio
    .from("company_members")
    .select("company_id")
    .eq("user_id", profile.id)
    .limit(1)
    .single();

  return member?.company_id ?? null;
}

/**
 * Fetch all contractors (companies) from Kontraio with their owner profile.
 */
export async function fetchKontraioContractors() {
  const kontraio = createKontraioClient();

  // Fetch companies
  const { data: companies } = await kontraio
    .from("companies")
    .select("*")
    .order("name");

  if (!companies || companies.length === 0) return [];

  // Fetch company members (owners) with profiles
  const companyIds = companies.map((c) => c.id);
  const { data: members } = await kontraio
    .from("company_members")
    .select("company_id, user_id, role, profiles(full_name, avatar_url, job_title)")
    .in("company_id", companyIds)
    .eq("role", "owner");

  // Fetch catalog items (services) for each company
  const { data: catalogItems } = await kontraio
    .from("catalog_items")
    .select("company_id, name")
    .in("company_id", companyIds)
    .eq("is_active", true);

  // Map to a unified contractor format for Domustack
  return companies.map((company) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const owner = (members as any[])?.find(
      (m) => m.company_id === company.id
    );
    const services = catalogItems?.filter(
      (item) => item.company_id === company.id
    ) || [];

    const location = [company.city, company.state].filter(Boolean).join(", ");

    return {
      id: company.id,
      name: company.name,
      phone: company.phone,
      email: company.email,
      website: company.website,
      location: location || "Unknown",
      logo_url: company.logo_url,
      license_number: company.contractor_license_number,
      license_state: company.license_state,
      owner_name: owner?.profiles?.full_name || null,
      owner_avatar: owner?.profiles?.avatar_url || null,
      owner_title: owner?.profiles?.job_title || null,
      services: services.map((s) => s.name),
      source: "kontraio" as const,
    };
  });
}
