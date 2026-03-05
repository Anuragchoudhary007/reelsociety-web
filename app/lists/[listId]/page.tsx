"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

export default function ListDetailPage() {
  const { listId } = useParams();
  const { user } = useAuth();

  const [list, setList] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !listId) return;

    // Fetch list metadata
    const fetchList = async () => {
      const ref = doc(db, "users", user.uid, "lists", listId as string);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setList({ id: snap.id, ...snap.data() });
      }
    };

    fetchList();

    // Fetch list items
    const itemsRef = collection(
      db,
      "users",
      user.uid,
      "lists",
      listId as string,
      "items"
    );

    const unsub = onSnapshot(itemsRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setItems(data.sort((a, b) => a.rank - b.rank));
    });

    return () => unsub();
  }, [user, listId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);

    setItems(newItems);

    const batch = writeBatch(db);

    newItems.forEach((item, index) => {
      const ref = doc(
        db,
        "users",
        user!.uid,
        "lists",
        listId as string,
        "items",
        item.id
      );

      batch.update(ref, { rank: index + 1 });
    });

    await batch.commit();
  };

  const handleRemove = async (itemId: string) => {
    const ref = doc(
      db,
      "users",
      user!.uid,
      "lists",
      listId as string,
      "items",
      itemId
    );

    await deleteDoc(ref);

    const remaining = items.filter((item) => item.id !== itemId);

    const batch = writeBatch(db);

    remaining.forEach((item, index) => {
      const itemRef = doc(
        db,
        "users",
        user!.uid,
        "lists",
        listId as string,
        "items",
        item.id
      );

      batch.update(itemRef, { rank: index + 1 });
    });

    await batch.commit();
  };

  if (!list) return <div className="p-10">Loading...</div>;

  const activeItem = items.find((i) => i.id === activeId);

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-2">{list.title}</h1>
      <p className="text-gray-400 mb-8">{list.description}</p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event) => setActiveId(event.active.id)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <SortableCard
                key={item.id}
                item={item}
                index={index}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <div className="rounded-2xl overflow-hidden shadow-2xl scale-110">
              <img
                src={`https://image.tmdb.org/t/p/w500${activeItem.poster_path}`}
                alt={activeItem.title}
                className="w-[250px] h-[350px] object-cover"
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function SortableCard({ item, index, onRemove }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms cubic-bezier(0.25, 1, 0.5, 1)",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5 cursor-grab"
    >
      <div className="absolute top-2 left-2 bg-black/80 text-white text-sm px-3 py-1 rounded-full">
        #{index + 1}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        ✕
      </button>

      <img
        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
        alt={item.title}
        className="w-full h-[320px] object-cover"
      />

      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent p-4">
        <h3 className="text-sm font-semibold">{item.title}</h3>
      </div>
    </div>
  );
}