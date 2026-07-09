import { useState, useEffect } from "react";

/** Kiểu dữ liệu item trả về từ server */
type Item = {
  id: number;
  name: string;
};

const API_URL = "http://localhost:8080/api/items";

function Form() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(API_URL);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      setItems(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // ── READ: lấy danh sách khi component mount ──
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const resp = await fetch(API_URL);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json = await resp.json();
        if (!cancelled) setItems(json.data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Không tải được dữ liệu");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ── CREATE hoặc UPDATE (tùy editingId) ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");
    try {
      const isEditing = editingId !== null;
      const resp = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      await fetchItems(); // reload list sau khi ghi
      setName("");
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ── UPDATE: điền form để sửa ──
  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setName(item.name);
  };

  // ── DELETE ──
  const handleDelete = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      await fetchItems();
      if (editingId === id) {
        setEditingId(null);
        setName("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
  };

  return (
    <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>CRUD demo — React + fetch</h2>

      {/* Form CREATE / UPDATE */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={name}
          placeholder={editingId ? "Sửa tên..." : "Tên item mới..."}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          style={{ flex: 1, padding: "6px 10px" }}
        />
        <button type="submit" disabled={loading}>
          {editingId ? "Cập nhật" : "Thêm"}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancel} disabled={loading}>
            Hủy
          </button>
        )}
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Đang xử lý...</p>}

      {/* Danh sách READ */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <span>
              #{item.id} — {item.name}
            </span>
            <span style={{ display: "flex", gap: 8 }}>
              <button onClick={() => handleEdit(item)} disabled={loading}>
                Sửa
              </button>
              <button onClick={() => handleDelete(item.id)} disabled={loading}>
                Xóa
              </button>
            </span>
          </li>
        ))}
      </ul>

      {!loading && items.length === 0 && <p>Chưa có item nào.</p>}
    </div>
  );
}

export default Form;
