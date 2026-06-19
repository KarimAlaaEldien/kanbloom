"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-200/50 dark:border-neutral-800/80 animate-pop-in text-center flex flex-col items-center">
        
        {/* Close Button */}
        <div className="w-full flex justify-end">
          <button
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-all"
            aria-label="Close confirmation dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>

        {/* Text Details */}
        <h3 className="font-heading text-lg font-bold text-text-primary dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-text-secondary dark:text-neutral-400 mt-2 max-w-sm">
          {message}
        </p>

        {/* Actions Button Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold transition-all text-text-secondary dark:text-neutral-300"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
