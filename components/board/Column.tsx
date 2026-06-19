"use client";

import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column as ColumnType, Card as CardType } from "@/types";
import Card from "./Card";
import { createCard, deleteColumn, updateColumn } from "@/lib/firestore";
import { Plus, Trash2, X, PlusCircle, Sprout, Edit2, Check } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  boardId: string;
  creatorName: string;
  onCardClick: (card: CardType, columnId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  cards,
  boardId,
  creatorName,
  onCardClick,
}) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDesc, setNewCardDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Column edit states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const cardIds = cards.map((c) => c.id);

  const handleAddCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) {
      toast.error("Your card needs a name! 🏷️");
      return;
    }

    setLoading(true);
    try {
      const nextOrder = cards.length > 0 ? Math.max(...cards.map((c) => c.order)) + 1 : 1;
      await createCard(
        boardId,
        column.id,
        newCardTitle.trim(),
        newCardDesc.trim(),
        nextOrder,
        creatorName
      );

      toast.success("Planted a new card 🌱");
      setNewCardTitle("");
      setNewCardDesc("");
      setIsAddingCard(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to plant card.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTitle = async () => {
    if (!editedTitle.trim()) {
      setEditedTitle(column.title);
      setIsEditingTitle(false);
      return;
    }
    if (editedTitle.trim() === column.title) {
      setIsEditingTitle(false);
      return;
    }

    try {
      await updateColumn(boardId, column.id, editedTitle.trim());
      setIsEditingTitle(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to rename column.");
    }
  };

  const handleDeleteColumn = async () => {

    try {
      await deleteColumn(boardId, column.id);
      toast.success("Column uprooted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete column.");
    }
  };

  return (
    <div className="w-[300px] shrink-0 bg-neutral-100/70 dark:bg-neutral-900/40 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/80 flex flex-col max-h-full overflow-hidden shadow-sm">
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-200/30 dark:border-neutral-800/50 shrink-0">
        <div className="flex items-center gap-2 max-w-[80%]">
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                className="w-full px-2 py-1 text-sm font-heading font-semibold bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-bloom-green dark:text-white"
                autoFocus
              />
              <button onClick={handleSaveTitle} className="p-1 text-bloom-green hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg">
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 group">
              <h3
                onClick={() => setIsEditingTitle(true)}
                className="font-heading font-semibold text-sm text-text-primary dark:text-neutral-200 hover:text-bloom-green cursor-pointer truncate"
                title="Click to rename"
              >
                {column.title}
              </h3>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="p-1 rounded text-neutral-400 opacity-0 group-hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
          
          <span className="shrink-0 bg-neutral-200 dark:bg-neutral-800 text-[10px] font-bold text-text-secondary dark:text-neutral-400 px-2 py-0.5 rounded-full">
            {cards.length}
          </span>
        </div>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all shrink-0"
          title="Uproot column"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="Uproot Column?"
          message={`Are you sure you want to delete "${column.title}"? All cards inside will be lost! ⚠️`}
          confirmText="Uproot"
          onConfirm={() => {
            setShowDeleteConfirm(false);
            handleDeleteColumn();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </div>

      {/* Cards List container */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 min-h-[150px]"
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.length === 0 && !isAddingCard ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 opacity-40">
              <Sprout className="w-8 h-8 text-neutral-400 mb-1.5" />
              <span className="text-[10px] font-semibold text-text-secondary">
                Empty patch — plant a card 🌱
              </span>
            </div>
          ) : (
            cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                boardId={boardId}
                columnId={column.id}
                onClick={() => onCardClick(card, column.id)}
              />
            ))
          )}
        </SortableContext>
      </div>

      {/* Column Footer / Add Card form */}
      <div className="p-3 border-t border-neutral-200/30 dark:border-neutral-800/50 shrink-0">
        {isAddingCard ? (
          <form onSubmit={handleAddCardSubmit} className="flex flex-col gap-2 p-2 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800 animate-pop-in">
            <input
              type="text"
              placeholder="Card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-bloom-green dark:text-white"
              maxLength={60}
              required
              autoFocus
            />
            <textarea
              placeholder="Description (optional)..."
              value={newCardDesc}
              onChange={(e) => setNewCardDesc(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-bloom-green dark:text-white h-14 resize-none"
              maxLength={200}
            />
            <div className="flex gap-2 justify-end mt-1">
              <button
                type="button"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                  setNewCardDesc("");
                }}
                className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[10px] font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-bloom-green hover:bg-bloom-green-hover text-white text-[10px] font-semibold shadow-sm transition-all flex items-center gap-1 disabled:opacity-50"
              >
                {loading ? "..." : (
                  <>
                    Plant 🌱
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-bloom-green hover:border-bloom-green/50 dark:hover:border-bloom-green/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Card
          </button>
        )}
      </div>
    </div>
  );
};

export default Column;
