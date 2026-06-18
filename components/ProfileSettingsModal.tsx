"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { X, User, Image, Save, Flower } from "lucide-react";
import toast from "react-hot-toast";
import UserAvatar from "./UserAvatar";

interface ProfileSettingsModalProps {
  onClose: () => void;
}

const AVATAR_PRESETS = [
  { name: "Sunflower 🌻", url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Rose 🌹", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Cactus 🌵", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Sprout 🌿", url: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Blossom 🌸", url: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&w=150&h=150&q=80" },
];

export default function ProfileSettingsModal({ onClose }: ProfileSettingsModalProps) {
  const { user, userProfile, updateProfileData } = useAuth();
  const [name, setName] = useState(userProfile?.displayName || user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(userProfile?.photoURL || user?.photoURL || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name!");
      return;
    }

    setSaving(true);
    try {
      await updateProfileData(name.trim(), photoURL.trim());
      toast.success("Profile updated successfully! 🌿");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/50 dark:border-neutral-800/80 animate-pop-in flex flex-col text-left">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 shrink-0">
          <div className="flex items-center gap-2 text-text-secondary dark:text-neutral-400">
            <Flower className="w-4 h-4 text-bloom-green" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Gardener Profile Settings
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-all"
            aria-label="Close profile settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
            
            {/* Avatar Preview */}
            <div className="flex flex-col items-center justify-center gap-2 pb-2">
              <UserAvatar src={photoURL} name={name || "Gardener"} size="lg" className="w-20 h-20 shadow-md border-4 border-bloom-green/30" />
              <span className="text-[10px] text-text-secondary dark:text-neutral-400">Live Preview</span>
            </div>

            {/* Display Name Input */}
            <div className="space-y-2">
              <label htmlFor="gardener-name" className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-neutral-400">
                <User className="w-3.5 h-3.5" />
                Gardener Name
              </label>
              <input
                id="gardener-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bloom-green focus:border-transparent dark:text-white"
                maxLength={40}
                placeholder="Karim Alaa"
                required
              />
            </div>

            {/* Avatar URL Input */}
            <div className="space-y-2">
              <label htmlFor="avatar-url" className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-neutral-400">
                <Image className="w-3.5 h-3.5" />
                Profile Image URL
              </label>
              <input
                id="avatar-url"
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bloom-green focus:border-transparent dark:text-white"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            {/* Botanical Presets */}
            <div className="space-y-3">
              <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-neutral-400">
                Or pick a Garden Preset
              </span>
              <div className="flex flex-wrap gap-3">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setPhotoURL(preset.url)}
                    className={`group relative flex flex-col items-center justify-center p-1.5 rounded-2xl border-2 transition-all ${
                      photoURL === preset.url
                        ? "border-bloom-green bg-bloom-green/5"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-bloom-green/50 bg-transparent"
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <span className="text-[9px] font-semibold text-text-secondary dark:text-neutral-400 mt-1">
                      {preset.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Footer actions */}
          <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800/80 flex justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
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
        </form>

      </div>
    </div>
  );
}
