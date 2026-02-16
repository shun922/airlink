"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Resource {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  category: string;
}

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [resource, setResource] = useState<Resource | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [category, setCategory] = useState("general");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/resources/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          router.push("/admin/resources");
          return;
        }
        setResource(data);
        setName(data.name);
        setDescription(data.description || "");
        setCapacity(data.capacity ?? 1);
        setCategory(data.category || "general");
      });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch(`/api/resources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, capacity, category }),
    });
    setSubmitting(false);
    if (res.ok) {
      router.push("/admin/resources");
    } else {
      const err = await res.json();
      alert(err.error || "更新に失敗しました");
    }
  };

  if (!resource) {
    return <div className="text-slate-600">読み込み中...</div>;
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">リソース編集</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">名前 *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">収容人数</label>
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">カテゴリ</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "更新中..." : "更新"}
          </button>
          <Link
            href="/admin/resources"
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
