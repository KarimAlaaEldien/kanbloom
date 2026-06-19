"use client";

import React, { useState, useEffect } from "react";
import { Board, UserProfile } from "@/types";
import { updateBoard, inviteUserByEmail } from "@/lib/firestore";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Users, UserPlus, Edit2, Check, X, Calendar, Share2, Mail, Copy } from "lucide-react";
import toast from "react-hot-toast";
import UserAvatar from "@/components/UserAvatar";

interface BoardHeaderProps {
  board: Board;
  boardId: string;
  isOwner: boolean;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({ board, boardId, isOwner }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(board.title);
  
  // Members details
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Invite modal states
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [lastInvitedEmail, setLastInvitedEmail] = useState("");

  // Parse description and color
  const parseBoardData = (desc: string) => {
    if (!desc) return { description: "", color: "bloom-green" };
    const parts = desc.split("||");
    return {
      description: parts[0] || "",
      color: parts[1] || "bloom-green",
    };
  };

  const { description: boardDesc, color: boardColor } = parseBoardData(board.description);

  // Fetch member profiles when memberIds changes
  useEffect(() => {
    if (!board.memberIds || board.memberIds.length === 0) return;

    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        const fetched: UserProfile[] = [];
        for (const uid of board.memberIds) {
          const docRef = doc(db, "users", uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            fetched.push(snap.data() as UserProfile);
          } else {
            fetched.push({
              uid,
              displayName: "Gardener",
              email: "",
              photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`,
            });
          }
        }
        setMembers(fetched);
      } catch (err) {
        console.error("Error fetching board members: ", err);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [board.memberIds]);

  const handleSaveTitle = async () => {
    if (!editedTitle.trim()) {
      setEditedTitle(board.title);
      setIsEditingTitle(false);
      return;
    }
    if (editedTitle.trim() === board.title) {
      setIsEditingTitle(false);
      return;
    }

    try {
      await updateBoard(boardId, { title: editedTitle.trim() });
      setIsEditingTitle(false);
      toast.success("Garden board renamed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to rename board.");
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error("Please enter a valid email address! 📧");
      return;
    }

    setInviting(true);
    try {
      const res = await inviteUserByEmail(boardId, inviteEmail.trim());
      if (res.success) {
        toast.success(res.message);
        setLastInvitedEmail(inviteEmail.trim());
        setIsNewUser(res.isNew || false);
        setInviteSuccess(true);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during invitation.");
    } finally {
      setInviting(false);
    }
  };

  const formattedDate = board.createdAt
    ? new Date(board.createdAt.seconds * 1000).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Just now";

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-neutral-900 border-b border-neutral-200/50 dark:border-neutral-800/80 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
      
      {/* Title & Info */}
      <div className="flex-1 flex flex-col gap-1.5 text-left">
        <div className="flex items-center gap-3">
          {isEditingTitle ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                className="px-3 py-1 text-2xl font-heading font-bold bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-bloom-green dark:text-white"
                autoFocus
              />
              <button onClick={handleSaveTitle} className="p-2 text-bloom-green hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl">
                <Check className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-text-primary dark:text-white hover:text-bloom-green cursor-pointer"
                title="Click to rename"
              >
                {board.title}
              </h1>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="p-1.5 rounded-xl text-neutral-400 opacity-0 group-hover:opacity-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Color Indicator Badge */}
          <span className={`w-3.5 h-3.5 rounded-full shrink-0 shadow-sm ${
            boardColor === "blossom-pink" ? "bg-blossom-pink" :
            boardColor === "indigo" ? "bg-indigo-500" :
            boardColor === "amber" ? "bg-amber-500" :
            boardColor === "teal" ? "bg-teal-500" : "bg-bloom-green"
          }`} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>Sown: {formattedDate}</span>
          </span>
          {boardDesc && (
            <>
              <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
              <span className="italic truncate max-w-sm" title={boardDesc}>
                "{boardDesc}"
              </span>
            </>
          )}
        </div>
      </div>

      {/* Collaborators & Sharing Actions */}
      <div className="flex items-center gap-4 shrink-0 justify-start md:justify-end">
        {/* Members Avatars List */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-text-secondary dark:text-neutral-400 hidden lg:inline mr-1">
            Gardeners:
          </span>
          <div className="flex -space-x-2.5 overflow-hidden">
            {members.map((member) => (
              <div key={member.uid} title={`${member.displayName} (${member.email})`}>
                <UserAvatar
                  src={member.photoURL}
                  name={member.displayName}
                  uid={member.uid}
                  size="sm"
                  className="w-9 h-9 border-2 border-white dark:border-neutral-900"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Invite Trigger Button */}
        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-bloom-green/20 hover:border-bloom-green bg-bloom-green/5 hover:bg-bloom-green/10 text-bloom-green font-semibold transition-all text-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite</span>
        </button>
      </div>

      {/* Invite Collaborator Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-pop-in text-left">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-bloom-green" />
                <h3 className="font-heading text-lg font-bold text-text-primary dark:text-white">
                  {inviteSuccess ? "Invitation Planted! 🌱" : "Add a Gardener"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsInviteOpen(false);
                  setInviteSuccess(false);
                  setInviteEmail("");
                }}
                className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-all"
                aria-label="Close invitation modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteSuccess ? (
              <div className="space-y-5">
                {isNewUser ? (
                  <>
                    <p className="text-xs text-text-secondary dark:text-neutral-400 leading-relaxed">
                      Since <span className="font-semibold text-bloom-green">{lastInvitedEmail}</span> is not registered on Kanbloom yet, we've created a pending invitation. Use one of the options below to invite them to join:
                    </p>

                    <div className="flex flex-col gap-2.5">
                      {/* Send Email Invitation Button */}
                      <a
                        href={`mailto:${lastInvitedEmail}?subject=${encodeURIComponent("Join my Kanbloom board! 🌿")}&body=${encodeURIComponent(
                          `Hi!\n\nI have invited you to collaborate on my task board "${board.title}" on Kanbloom.\n\nClick the link below to sign up and join the board automatically:\nhttps://kanbloom.vercel.app/signup?email=${lastInvitedEmail}\n\nHappy growing! 🌱`
                        )}`}
                        className="w-full py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 text-text-primary dark:text-neutral-200 text-xs font-semibold transition-all flex items-center justify-between group"
                      >
                        <span className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-bloom-green transition-colors" />
                          Send via Email
                        </span>
                        <span className="text-[10px] text-text-secondary dark:text-neutral-500 font-normal">Opens mail app</span>
                      </a>

                      {/* Copy Share Link Button */}
                      <button
                        onClick={() => {
                          const inviteLink = `https://kanbloom.vercel.app/signup?email=${lastInvitedEmail}`;
                          navigator.clipboard.writeText(inviteLink);
                          toast.success("Invitation link copied to clipboard! 📋");
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 text-text-primary dark:text-neutral-200 text-xs font-semibold transition-all flex items-center justify-between group"
                      >
                        <span className="flex items-center gap-2">
                          <Copy className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-bloom-green transition-colors" />
                          Copy Invitation Link
                        </span>
                        <span className="text-[10px] text-text-secondary dark:text-neutral-500 font-normal">Share via WhatsApp / chat</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-text-secondary dark:text-neutral-400 leading-relaxed">
                    Successfully added <span className="font-semibold text-bloom-green">{lastInvitedEmail}</span> to this board! They can access it from their dashboard immediately. 🌸
                  </p>
                )}

                <div className="flex justify-end pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={() => {
                      setIsInviteOpen(false);
                      setInviteSuccess(false);
                      setInviteEmail("");
                    }}
                    className="px-6 py-2.5 rounded-xl bg-bloom-green hover:bg-bloom-green-hover text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <label htmlFor="invite-email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-neutral-400 mb-2">
                    Teammate's Email Address
                  </label>
                  <input
                    id="invite-email"
                    type="email"
                    placeholder="teammate@kanbloom.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bloom-green focus:border-transparent dark:text-white"
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsInviteOpen(false);
                      setInviteEmail("");
                    }}
                    className="px-4.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="px-5 py-2.5 rounded-xl bg-bloom-green hover:bg-bloom-green-hover text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {inviting ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>
                        Invite 🌸
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardHeader;
