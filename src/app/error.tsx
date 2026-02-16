"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-medium text-slate-700 mb-4">エラーが発生しました</h2>
      <button
        onClick={reset}
        className="px-6 py-2 bg-sky-400 text-white rounded-full hover:bg-sky-500"
      >
        再試行
      </button>
    </div>
  );
}
