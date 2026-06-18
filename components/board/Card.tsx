"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card as CardType } from "@/types";
import { Calendar, AlignLeft, User } from "lucide-react";

interface CardProps {
  card: CardType;
  boardId: string;
  columnId: string;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({ card, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Format date safely
  const formattedDate = card.createdAt
    ? new Date(card.createdAt.seconds * 1000).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "Just now";

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-full min-h-[90px] rounded-2xl bg-bloom-green/5 border-2 border-dashed border-bloom-green/30 opacity-40"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="group w-full p-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm hover:shadow-md border border-neutral-200/50 dark:border-neutral-800/80 hover:border-bloom-green/30 dark:hover:border-bloom-green/30 transition-all duration-200 cursor-grab active:cursor-grabbing select-none text-left flex flex-col gap-2.5 animate-pop-in"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-heading text-sm font-semibold text-text-primary dark:text-neutral-200 leading-snug group-hover:text-bloom-green transition-colors line-clamp-2">
          {card.title}
        </h4>
      </div>

      {card.description && (
        <p className="text-xs text-text-secondary dark:text-neutral-400 line-clamp-2 leading-relaxed">
          {card.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/60 text-[10px] text-text-secondary dark:text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          {card.description && (
            <span title="Has description">
              <AlignLeft className="w-3.5 h-3.5 text-neutral-400" />
            </span>
          )}
          
          <div className="w-5 h-5 rounded-full bg-bloom-green/10 text-bloom-green flex items-center justify-center border border-bloom-green/20" title={`Created by ${card.createdBy || "gardener"}`}>
            <User className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
