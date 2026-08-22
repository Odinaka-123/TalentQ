"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import PortfolioUploadModal, { PortfolioDraft } from "./PortfolioUploadModal";

type PortfolioItem = {
  id: string;
  title: string;
  image_url: string | null;
  tags: string[] | null;
};

type PortfolioGridProps = {
  items: PortfolioItem[];
  onAdd?: (draft: PortfolioDraft) => Promise<void>;
};

export default function PortfolioGrid({ items, onAdd }: PortfolioGridProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (draft: PortfolioDraft) => {
    if (!onAdd) return;
    await onAdd(draft);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-2xl border-2 border-dashed border-[#E5E0D6] bg-white flex flex-col items-center justify-center gap-2 min-h-[13.5rem] text-[#8A8A7E] hover:border-[#DE814A] hover:text-[#C6543A] transition-colors"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FBEADB]">
            <Plus size={16} className="text-[#DE814A]" />
          </span>
          <span className="text-sm font-medium">Add Project</span>
        </button>

        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[#E5E0D6] bg-white overflow-hidden"
          >
            <div className="w-full h-36 bg-[#F5F1E9] relative">
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="px-4 py-3 border-t-2 border-[#DE814A]">
              <p className="text-sm font-semibold text-[#C6543A]">
                {item.title}
              </p>
              {item.tags && item.tags.length > 0 && (
                <p className="text-xs text-[#8A8A7E] mt-0.5">
                  {item.tags.join(" . ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-xs text-[#8A8A7E] text-center mt-4">
          No portfolio items yet — add your first project above.
        </p>
      )}

      {modalOpen && (
        <PortfolioUploadModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
