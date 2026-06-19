"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { createBoard, deleteBoard } from "@/lib/firestore";
import { Board } from "@/types";
import { Plus, Users, Calendar, ArrowRight, Trash2, Sprout, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

const BOARD_COLORS = [
  { name: "Bloom Green 🌿", value: "bloom-green", hex: "#22C55E", bg: "bg-bloom-green" },
  { name: "Blossom Pink 🌸", value: "blossom-pink", hex: "#F472B6", bg: "bg-blossom-pink" },
  { name: "Lilac Lavender 🪻", value: "indigo", hex: "#6366F1", bg: "bg-indigo-500" },
  { name: "Sunflower Gold 🌻", value: "amber", hex: "#F59E0B", bg: "bg-amber-500" },
  { name: "Eucalyptus Teal 🍃", value: "teal", hex: "#14B8A6", bg: "bg-teal-500" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(BOARD_COLORS[0].value);
  const [submitting, setSubmitting] = useState(false);
  
  // Delete confirm state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<{ id: string; title: string } | null>(null);

  // Sync boards list in real-time
  useEffect(() => {
    if (!user) return;

    const boardsRef = collection(db, "boards");
    // Query boards where current user is a member
    const q = query(
      boardsRef,
      where("memberIds", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const boardsList: Board[] = [];
      snapshot.forEach((doc) => {
        boardsList.push({ id: doc.id, ...doc.data() } as Board);
      });
      
      // Sort in-memory to bypass composite index requirement
      boardsList.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setBoards(boardsList);
      setLoading(false);
    }, (error) => {
      console.error("Error loading boards: ", error);
      toast.error("Failed to load your boards 💧");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please name your board! 🏷️");
      return;
    }
    if (!user) return;

    setSubmitting(true);
    try {
      // Save color in description metadata or doc if wanted, 
      // but let's append color tag to description or save in description field.
      // We can encode color directly into a structured metadata string or store it.
      // Let's store description as JSON, or simply append a color code.
      // A clean way is storing it as: description + "||" + color
      const combinedDescription = `${description.trim()}||${selectedColor}`;
      
      const boardId = await createBoard(title.trim(), combinedDescription, user.uid);
      
      toast.success("Nice, your new board is growing! 🌱");
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setSelectedColor(BOARD_COLORS[0].value);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to create board. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard(boardId);
      toast.success("Board has been uprooted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete board.");
    }
  };

  // Helper to parse description and color from combined string
  const parseBoardData = (desc: string) => {
    if (!desc) return { description: "", color: "bloom-green" };
    const parts = desc.split("||");
    return {
      description: parts[0] || "",
      color: parts[1] || "bloom-green",
    };
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 rounded-full border-4 border-bloom-green/30 border-t-bloom-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-text-primary dark:text-white">
            Your Gardens
          </h1>
          <p className="text-sm text-text-secondary dark:text-neutral-400 mt-1">
            Manage your collaborative projects and watch your tasks grow.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-bloom-green hover:bg-bloom-green-hover text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-sm"
        >
          <Plus className="w-4 h-4" />
          Plant New Board
        </button>
      </div>

      {/* Boards Grid */}
      {boards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-neutral-900/40 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 min-h-[350px] animate-pop-in">
          <div className="w-16 h-16 rounded-full bg-bloom-green/10 text-bloom-green flex items-center justify-center mb-4">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-xl font-bold text-text-primary dark:text-white">
            No boards growing yet
          </h3>
          <p className="text-sm text-text-secondary dark:text-neutral-400 max-w-sm mt-2">
            Your workspace is ready for planting! Create your first task board and start cultivating your workflow.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 px-6 py-3 rounded-xl bg-bloom-green hover:bg-bloom-green-hover text-white font-semibold text-sm shadow-md transition-all"
          >
            Sow Your First Seed 🌱
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => {
            const { description: cleanDesc, color: boardColor } = parseBoardData(board.description);
            const colorOption = BOARD_COLORS.find(c => c.value === boardColor) || BOARD_COLORS[0];
            const isOwner = board.ownerId === user?.uid;

            return (
              <Link
                key={board.id}
                href={`/board/${board.id}`}
                className="group block relative bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm hover:shadow-md border border-neutral-200/50 dark:border-neutral-800/80 transition-all duration-200 overflow-hidden text-left"
              >
                {/* Board Color Tag */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${colorOption.bg}`} />

                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-heading text-lg font-bold text-text-primary dark:text-white group-hover:text-bloom-green transition-colors line-clamp-1">
                    {board.title}
                  </h3>
                  
                  {isOwner && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setBoardToDelete({ id: board.id, title: board.title });
                        setShowDeleteConfirm(true);
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Uproot board"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-text-secondary dark:text-neutral-400 mt-2 line-clamp-2 h-8">
                  {cleanDesc || "No description set for this garden board."}
                </p>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-text-secondary dark:text-neutral-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>
                      {board.createdAt ? new Date(board.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1" title="Collaborators">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{board.memberIds?.length || 1}</span>
                    </div>
                    
                    <span className="flex items-center text-bloom-green group-hover:translate-x-1 transition-transform font-bold">
                      Open <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Modal - Create Board */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-pop-in text-left">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-bloom-green" />
                <h3 className="font-heading text-xl font-bold text-text-primary dark:text-white">
                  Plant a New Board
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-all"
                aria-label="Close create board modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-5">
              <div>
                <label htmlFor="board-title" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-neutral-400 mb-2">
                  Board Title
                </label>
                <input
                  id="board-title"
                  type="text"
                  placeholder="e.g. Marketing Campaign 🌸, Spring Tasks 🌿"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bloom-green focus:border-transparent dark:text-white"
                  maxLength={50}
                  required
                />
              </div>

              <div>
                <label htmlFor="board-desc" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-neutral-400 mb-2">
                  Board Description (Optional)
                </label>
                <textarea
                  id="board-desc"
                  placeholder="What is this board growing? Outline the goals or focus..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bloom-green focus:border-transparent dark:text-white h-24 resize-none"
                  maxLength={150}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-neutral-400 mb-2.5">
                  Garden Theme Color
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {BOARD_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`h-11 rounded-xl flex items-center justify-center text-[10px] font-bold text-white transition-all shadow-sm ${color.bg} ${
                        selectedColor === color.value
                           ? "ring-4 ring-offset-2 ring-bloom-green dark:ring-offset-neutral-900 scale-105"
                          : "hover:scale-[1.03]"
                      }`}
                      title={color.name}
                    >
                      {selectedColor === color.value && "✓"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-bloom-green hover:bg-bloom-green-hover text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      Sow Seed 🌱
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm && !!boardToDelete}
        title="Uproot Board?"
        message={boardToDelete ? `Are you sure you want to delete "${boardToDelete.title}"? This will uproot all tasks!` : ""}
        confirmText="Uproot"
        onConfirm={() => {
          if (boardToDelete) {
            handleDeleteBoard(boardToDelete.id);
            setBoardToDelete(null);
          }
          setShowDeleteConfirm(false);
        }}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setBoardToDelete(null);
        }}
      />
    </div>
  );
}
