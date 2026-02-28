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
