// components/FavouriteCauses.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase/config";
import { doc, deleteDoc } from "firebase/firestore";
import { getSessionId } from "@/lib/helpers";
import { MainCauseCard } from "@/components/CauseCard";
import { Cause } from "@/lib/type";

interface FavouriteCausesProps {
  bookmarkedCauses: Cause[];
}

const FavouriteCauses: React.FC<FavouriteCausesProps> = ({
  bookmarkedCauses,
}) => {
  const [bookmarks, setBookmarks] = useState<Cause[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = getSessionId();

  useEffect(() => {
    if (bookmarkedCauses) {
      setBookmarks(bookmarkedCauses);
      setIsLoading(false);
    }
  }, [bookmarkedCauses]);

  const removeBookmark = async (id: string) => {
    if (!userId) return;

    try {
      const bookmarkRef = doc(db, `users/${userId}/bookmarked`, id);
      await deleteDoc(bookmarkRef);

      const updatedBookmarks = bookmarks.filter((cause) => cause.id !== id);
      setBookmarks(updatedBookmarks);

      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">Favourite Causes</h1>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">Favourite Causes</h1>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <p className="text-gray-600 mb-4">
            You have no favourite causes at this time 🙂
          </p>
          <Link href="/">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Browse Causes →
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((cause) => (
            <MainCauseCard
              key={cause.id}
              {...cause} // Spread all properties from cause
              hideDescription={false}
              hideTags={false}
              hideButton={false}
              onRemoveBookmark={removeBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouriteCauses;
