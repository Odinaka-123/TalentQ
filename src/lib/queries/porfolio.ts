import { createClient } from "@/lib/supabase/client";

type PortfolioItem = {
  id: string;
  title: string;
  image_url: string | null;
  tags: string[] | null;
};

export async function addPortfolioItem({
  userId,
  title,
  tags,
  file,
}: {
  userId: string;
  title: string;
  tags: string[];
  file: File;
}): Promise<PortfolioItem> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio")
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("portfolio").getPublicUrl(filePath);

  const { data, error: insertError } = await supabase
    .from("portfolio_items")
    .insert({
      user_id: userId,
      title,
      image_url: publicUrl,
      tags,
    })
    .select("id, title, image_url, tags")
    .single();

  if (insertError) throw insertError;

  return data;
}