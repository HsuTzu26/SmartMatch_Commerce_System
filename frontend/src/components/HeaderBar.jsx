import React, { useState, useEffect } from "react";
import "../App.css";

export default function HeaderBar({
  categories,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
  likeCount,
  dislikeCount,
  favorites,
  setSearchQuery,
}) {
  const [search, setSearch] = useState("");
  const [favAnimated, setFavAnimated] = useState(false);

  // ✅ 當收藏變化時觸發動畫
  useEffect(() => {
    if (favorites?.length > 0) {
      setFavAnimated(true);
      const timer = setTimeout(() => setFavAnimated(false), 600);
      return () => clearTimeout(timer);
    }
  }, [favorites?.length]);

  const modes = [
    { key: "cards", label: "🃏 卡片模式" },
    { key: "list", label: "📜 清單模式" },
    { key: "favorites", label: "💛 收藏" },
    { key: "swiped", label: "🌀 已滑過" },
  ];

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    setSearchQuery?.(val);
  };

  return (
    <header className="app-header glass-header">
      <div className="header-top">
      <h1 className="logo">
        <img src="/logo.png" alt="SmartMatch Commerce Logo" className="logo-img" />
        智Go配 (SmartMatch Commerce)
      </h1>
      </div>

      {/* 控制區 */}
      <div className="header-controls">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "全部分類" : cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="🔍 搜尋商品..."
          value={search}
          onChange={handleSearch}
          className="search-input"
        />

        <div className="mode-toggle">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setViewMode(m.key)}
              className={`mode-btn ${viewMode === m.key ? "active" : ""}`}
            >
              {m.label}
              {m.key === "favorites" && (
                <span
                  className={`badge ${favAnimated ? "pulse" : ""}`}
                  key={favorites?.length}
                >
                  {favorites?.length || 0}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="stats">
        <span>❤️ 喜歡：{likeCount}</span>
        <span>💔 不喜歡：{dislikeCount}</span>
      </div>
    </header>
  );
}
