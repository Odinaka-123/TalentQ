import { SupabaseClient } from "@supabase/supabase-js";

export type NewPortfolioItem = {
  title: string;
  image_url: string;
  tags: string[];
};

export async function insertPortfolioItem(
  supabase: SupabaseClient,
  userId: string,
  item: NewPortfolioItem,
) {
  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({
      freelancer_id: userId, // ← confirm this is the right FK column name
      title: item.title,
      image_url: item.image_url,
      tags: item.tags,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
