"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, collection, query, orderBy, onSnapshot, getDoc } from "firebase/firestore";
import { createColumn, updateCardOrders, moveCardToColumn } from "@/lib/firestore";
import { Board, Column as ColumnType, Card as CardType } from "@/types";
import BoardHeader from "@/components/board/BoardHeader";
import Column from "@/components/board/Column";
import CardModal from "@/components/board/CardModal";
import Card from "@/components/board/Card";
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ChevronLeft, Lock, Plus, Sprout, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.boardId as string;
  const { user, loading: authLoading } = useAuth();

  // State
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [cardsMap, setCardsMap] = useState<Record<string, CardType[]>>({});
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // Column creation state
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColTitle, setNewColTitle] = useState("");
  const [addingCol, setAddingCol] = useState(false);

  // Active Drag State
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Selected Card for Modal
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [selectedCardColId, setSelectedCardColId] = useState<string>("");

  // Configure drag sensors with threshold activation to support clicking buttons/inputs
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 1. Sync Board Info & Verify Access
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!boardId) return;

    const boardRef = doc(db, "boards", boardId);
    const unsubscribe = onSnapshot(boardRef, (snap) => {
      if (!snap.exists()) {
        toast.error("Board not found! 🔎");
        router.push("/dashboard");
        return;
      }

      const boardData = snap.data();
      if (!boardData) return;
      
      // Verify access permission
      if (boardData.ownerId !== user.uid && !boardData.memberIds.includes(user.uid)) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      setBoard({ id: snap.id, ...boardData } as Board);
      setLoading(false);
    }, (error) => {
      console.error("Error loading board metadata:", error);
      setAccessDenied(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [boardId, user, authLoading, router]);

  // 2. Sync Columns in Real Time
  useEffect(() => {
    if (!boardId || accessDenied) return;

    const colsRef = collection(db, "boards", boardId, "columns");
    const q = query(colsRef, orderBy("order", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const colList: ColumnType[] = [];
      snapshot.forEach((doc) => {
        colList.push({ id: doc.id, ...doc.data() } as ColumnType);
      });
      setColumns(colList);
    }, (error) => {
      console.error("Error loading columns:", error);
    });

    return () => unsubscribe();
  }, [boardId, accessDenied]);

  // 3. Sync Cards for each Column dynamically
  useEffect(() => {
    if (!boardId || columns.length === 0) {
      return;
    }

    const unsubscribes: (() => void)[] = [];

    columns.forEach((col) => {
      const cardsRef = collection(db, "boards", boardId, "columns", col.id, "cards");
      const q = query(cardsRef, orderBy("order", "asc"));

      const unsub = onSnapshot(q, (snapshot) => {
        const colCards: CardType[] = [];
        snapshot.forEach((doc) => {
          colCards.push({ id: doc.id, ...doc.data() } as CardType);
        });

        setCardsMap((prev) => ({
          ...prev,
          [col.id]: colCards,
        }));
      });

      unsubscribes.push(unsub);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [boardId, columns]);

  // Helper to add a new column
  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColTitle.trim()) return;

    setAddingCol(true);
    try {
      const nextOrder = columns.length > 0 ? Math.max(...columns.map((c) => c.order)) + 1 : 1;
      await createColumn(boardId, newColTitle.trim(), nextOrder);
      setNewColTitle("");
      setIsAddingColumn(false);
      toast.success("Planted a new growth stage! 🌿");
    } catch (err) {
      console.error(err);
      toast.error("Failed to plant column.");
    } finally {
      setAddingCol(false);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (event: any) => {
    setActiveCardId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    setActiveCardId(null);
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id as string;
    const overId = over.id as string;

    // Find source column and card
    let sourceColId = "";
    let activeCard: CardType | null = null;

    for (const colId in cardsMap) {
      const card = cardsMap[colId].find((c) => c.id === cardId);
      if (card) {
        sourceColId = colId;
        activeCard = card;
        break;
      }
    }

    if (!activeCard || !sourceColId) return;

    // Find destination column
    let destColId = "";
    if (columns.some((col) => col.id === overId)) {
      destColId = overId;
    } else {
      for (const colId in cardsMap) {
        if (cardsMap[colId].some((c) => c.id === overId)) {
          destColId = colId;
          break;
        }
      }
    }

    if (!destColId) return;

    // Same Column Reorder
    if (sourceColId === destColId) {
      const colCards = [...cardsMap[sourceColId]];
      const oldIndex = colCards.findIndex((c) => c.id === cardId);
      const newIndex = colCards.findIndex((c) => c.id === overId);

      if (oldIndex !== newIndex && newIndex !== -1) {
        const newCards = arrayMove(colCards, oldIndex, newIndex);
        const ordered = newCards.map((c, i) => ({ ...c, order: i + 1 }));

        // Optimistic local state update
        setCardsMap((prev) => ({
          ...prev,
          [sourceColId]: ordered,
        }));

        try {
          await updateCardOrders(boardId, sourceColId, ordered.map((c) => ({ id: c.id, order: c.order })));
          toast.success("Card order growing! 🌱", { id: "drag-toast" });
        } catch (err) {
          console.error(err);
          toast.error("Failed to save order.");
        }
      }
    } 
    // Cross-Column Move
    else {
      const sourceCards = [...(cardsMap[sourceColId] || [])];
      const destCards = [...(cardsMap[destColId] || [])];

      const oldIndex = sourceCards.findIndex((c) => c.id === cardId);
      const cardToMove = sourceCards[oldIndex];

      sourceCards.splice(oldIndex, 1);

      let targetIndex = destCards.length;
      const overCardIndex = destCards.findIndex((c) => c.id === overId);
      if (overCardIndex !== -1) {
        targetIndex = overCardIndex;
      }

      destCards.splice(targetIndex, 0, cardToMove);

      const updatedSource = sourceCards.map((c, i) => ({ ...c, order: i + 1 }));
      const updatedDest = destCards.map((c, i) => ({ ...c, order: i + 1 }));

      // Optimistic local update
      setCardsMap((prev) => ({
        ...prev,
        [sourceColId]: updatedSource,
        [destColId]: updatedDest,
      }));

      try {
        const cardCleanData = {
          title: cardToMove.title,
          description: cardToMove.description,
          createdBy: cardToMove.createdBy,
          createdAt: cardToMove.createdAt,
          order: cardToMove.order,
        };

        // Batch delete and set
        await moveCardToColumn(
          boardId,
          sourceColId,
          destColId,
          cardId,
          cardCleanData,
          targetIndex + 1
        );

        // Update other card orders
        await updateCardOrders(boardId, destColId, updatedDest.map((c) => ({ id: c.id, order: c.order })));
        await updateCardOrders(boardId, sourceColId, updatedSource.map((c) => ({ id: c.id, order: c.order })));

        toast.success("Nice, that one's growing! 🌿", { id: "drag-toast" });
      } catch (err) {
        console.error(err);
        toast.error("Failed to move card.");
      }
    }
  };

  // Find active card for drag overlay
  const activeCard = useMemo(() => {
    if (!activeCardId) return null;
    return Object.values(cardsMap)
      .flat()
      .find((c) => c.id === activeCardId) || null;
  }, [activeCardId, cardsMap]);

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full min-h-[400px]">
        <div className="w-10 h-10 rounded-full border-4 border-bloom-green/30 border-t-bloom-green animate-spin" />
      </div>
    );
  }

  if (accessDenied || !board) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="font-heading text-xl font-bold">Access Denied</h3>
        <p className="text-sm text-text-secondary dark:text-neutral-400 mt-2 max-w-sm">
          You don't have access to this board, or it doesn't exist. Ask the board owner to invite you to collaborate! 🌸
        </p>
        <Link
          href="/dashboard"
          className="mt-6 flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-bloom-green text-white font-semibold text-sm shadow-md transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const isOwner = board.ownerId === user?.uid;

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Board Header details & Invite controls */}
      <BoardHeader board={board} boardId={boardId} isOwner={isOwner} />

      {/* Columns drag zone */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-[#F5F5F4] dark:bg-bg-dark/40">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex items-start gap-6 p-6 h-full select-none min-w-max pb-12">
            
            {/* Columns List */}
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                cards={cardsMap[column.id] || []}
                boardId={boardId}
                creatorName={user?.displayName || "Gardener"}
                onCardClick={(card, colId) => {
                  setSelectedCard(card);
                  setSelectedCardColId(colId);
                }}
              />
            ))}

            {/* Plant Stage (Add Column) Column Element */}
            <div className="w-[300px] shrink-0">
              {isAddingColumn ? (
                <form
                  onSubmit={handleAddColumn}
                  className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md flex flex-col gap-3 animate-pop-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-bloom-green uppercase tracking-wider">
                      New Stage
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingColumn(false);
                        setNewColTitle("");
                      }}
                      className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Backlog, Testing 🌿"
                    value={newColTitle}
                    onChange={(e) => setNewColTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bloom-green dark:text-white"
                    maxLength={30}
                    required
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingColumn(false);
                        setNewColTitle("");
                      }}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addingCol}
                      className="px-4.5 py-1.5 rounded-lg bg-bloom-green hover:bg-bloom-green-hover text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1 disabled:opacity-50"
                    >
                      {addingCol ? "..." : (
                        <>
                          Plant stage 🌱
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-bloom-green hover:border-bloom-green/40 hover:bg-white/50 dark:hover:bg-neutral-900/30 font-heading font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Plant Growth Stage
                </button>
              )}
            </div>
          </div>

          {/* Drag Overlay visual for active cards */}
          <DragOverlay>
            {activeCard ? (
              <div className="transform rotate-2 scale-[1.02] shadow-xl opacity-90">
                <Card card={activeCard} boardId={boardId} columnId="" onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          columnId={selectedCardColId}
          columnTitle={columns.find((c) => c.id === selectedCardColId)?.title || "Column"}
          boardId={boardId}
          onClose={() => {
            setSelectedCard(null);
            setSelectedCardColId("");
          }}
        />
      )}
    </div>
  );
}
