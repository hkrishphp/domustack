import { createBrowserClient } from "@supabase/ssr";

// ============================================================
// Types matching DB schema
// ============================================================

export type Contractor = {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  rating: number;
  reviews_count: number;
  location: string;
  price_range: string;
  projects_count: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export type ContractorService = {
  id: string;
  contractor_id: string;
  service_name: string;
};

export type Review = {
  id: string;
  contractor_id: string;
  user_id: string | null;
  reviewer_name: string;
  content: string;
  rating: number;
  created_at: string;
};

export type InspirationCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Inspiration = {
  id: string;
  category_id: string;
  title: string;
  image_url: string;
  author: string;
  likes: number;
  created_at: string;
  inspiration_categories?: InspirationCategory;
};

export type ShopCategory = {
  id: string;
  name: string;
  image_url: string | null;
  product_count: number;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  price_display: string;
  rating: number;
  reviews_count: number;
  image_url: string | null;
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  contractor_id: string | null;
  name: string;
  description: string | null;
  status: "open" | "planning" | "in_progress" | "completed";
  progress: number;
  budget: string | null;
  start_date: string | null;
  end_date: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
  // Intake form fields
  service_types: string[] | null;
  property_type: string | null;
  budget_range: string | null;
  timeline: string | null;
  photos: string[] | null;
  expected_photos: string[] | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  contact_first_name: string | null;
  contact_last_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  preferred_contact: string | null;
  created_at: string;
  contractors?: { name: string } | null;
  users?: { full_name: string } | null;
};

export type Bid = {
  id: string;
  project_id: string;
  contractor_id: string;
  price_estimate: string;
  timeline: string;
  description: string;
  terms: string | null;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  created_at: string;
  updated_at: string;
  contractors?: {
    name: string;
    rating: number;
    reviews_count: number;
    location: string;
    image_url: string | null;
  } | null;
};

export type Conversation = {
  id: string;
  created_at: string;
  updated_at: string;
};

export type ConversationWithDetails = {
  id: string;
  updated_at: string;
  participant_name: string;
  participant_avatar: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

// ============================================================
// Browser client (for client components + real-time)
// ============================================================

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
