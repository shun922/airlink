"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Resource {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  category: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resources")
      .then((r) => r.json())
      .then((data) => {
        setResources(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
    if (res.ok) {
      setResources((prev) => prev.filter((r) => r.id !== id));
    } else {
      const err = await res.json();
      alert(err.error || "削除に失敗しました");
    }
  };

  if (loading) {
    return <div className="text-slate-600">読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">リソース管理</h1>
        <Link
          href="/admin/resources/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          新規追加
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">名前</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">説明</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">収容人数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">カテゴリ</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {resources.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{r.name}</td>
                <td className="px-6 py-4 text-slate-600">{r.description || "-"}</td>
                <td className="px-6 py-4 text-slate-600">{r.capacity}</td>
                <td className="px-6 py-4 text-slate-600">{r.category}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/resources/${r.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => handleDelete(r.id, r.name)}
                    className="text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {resources.length === 0 && (
          <div className="px-6 py-12 text-center text-slate-500">
            リソースがありません。新規追加してください。
          </div>
        )}
      </div>
    </div>
  );
}
