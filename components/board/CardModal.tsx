"use client";

import React, { useState } from "react";
import { Card } from "@/types";
import { updateCard, deleteCard } from "@/lib/firestore";
import { X, Trash2, Calendar, User, AlignLeft, MessageSquare, Layers, Save } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

interface CardModalProps {
  card: Card;
  columnId: string;
  columnTitle: string;
  boardId: string;
  onClose: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({
  card,
  columnId,
  columnTitle,
  boardId,
  onClose,
}) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please provide a title! 🏷️");
      return;
    }
    
    setSaving(true);
    try {
      await updateCard(boardId, columnId, card.id, {
        title: title.trim(),
        description: description.trim(),
      });
      toast.success("Card updated! 🌿");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update card.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {

    setDeleting(true);
    try {
      await deleteCard(boardId, columnId, card.id);
      toast.success("Card deleted successfully.");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete card.");
    } finally {
      setDeleting(false);
    }
  };

  const formattedDate = card.createdAt
    ? new Date(card.createdAt.seconds * 1000).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Just now";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/50 dark:border-neutral-800/80 animate-pop-in flex flex-col text-left">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 shrink-0">
          <div className="flex items-center gap-2 text-text-secondary dark:text-neutral-400">
            <Layers className="w-4 h-4 text-bloom-green" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Inside column: <span className="text-bloom-green font-bold">{columnTitle}</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-all"
            aria-label="Close task details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Card Title Input */}
          <div className="space-y-2">
            <label htmlFor="task-title" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-neutral-400">
              Task Name
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl font-heading text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-bloom-green focus:border-transparent dark:text-white"
              maxLength={60}
              placeholder="e.g. Design a logo draft"
              required
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-text-secondary dark:text-neutral-400">
              <AlignLeft className="w-4 h-4" />
              <label htmlFor="task-desc" className="block text-xs font-semibold uppercase tracking-wider">
                Description
              </label>
            </div>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bloom-green focus:border-transparent dark:text-white h-32 resize-none"
              placeholder="Provide a detailed description for this task..."
              maxLength={500}
            />
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs text-text-secondary dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <Calendar className="w-4 h-4 text-neutral-500" />
              </div>
              <div>
                <span className="block font-semibold text-[10px] uppercase text-neutral-400 leading-none mb-0.5">Created Date</span>
                <span>{formattedDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <User className="w-4 h-4 text-neutral-500" />
              </div>
              <div>
                <span className="block font-semibold text-[10px] uppercase text-neutral-400 leading-none mb-0.5">Created By</span>
                <span>{card.createdBy || "Gardener"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800/80 flex justify-between items-center shrink-0">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting || saving}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-red-200 dark:border-red-950 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete Card
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving || deleting}
              className="px-4.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || deleting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-bloom-green hover:bg-bloom-green-hover text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="Delete Card?"
          message="Are you sure you want to delete this card? This action is permanent! ⚠️"
          confirmText="Delete"
          onConfirm={() => {
            setShowDeleteConfirm(false);
            handleDelete();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </div>
    </div>
  );
};

export default CardModal;
