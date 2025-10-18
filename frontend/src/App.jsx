import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import HeaderBar from "./components/HeaderBar";
import CardStack from "./components/CardStack";
import ListView from "./components/ListView";
import LiveRecommendations from "./components/LiveRecommendations";
import FavoriteList from "./components/FavoriteList";
import SwipedSummary from "./components/SwipedSummary";
import "./App.css";

export default function App() {
  const [allItems, setAllItems] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });
  const [likedItems, setLikedItems] = useState([]);
  const [dislikedItems, setDislikedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("cards");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ⏳ 抓資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/items");
        const validItems = res.data.filter((i) => !i.Is_Suspicious);
        setAllItems(validItems);
      } catch (e) {
        console.error("資料載入錯誤:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 📦 分類
  const categories = useMemo(() => {
    const unique = new Set(allItems.map((i) => i.Cluster_Name));
    return ["all", ...Array.from(unique)];
  }, [allItems]);

  // 🔍 篩選 + 搜尋
  const filteredItems = useMemo(() => {
    const base =
      selectedCategory === "all"
        ? allItems
        : allItems.filter((i) => i.Cluster_Name === selectedCategory);

    if (!searchQuery) return base;
    return base.filter((i) =>
      i.Item_Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allItems, selectedCategory, searchQuery]);

  // 💛 收藏
  const handleFavorite = (item) => {
    const exists = favorites.some((f) => f.Item_Name === item.Item_Name);
    const updated = exists
      ? favorites.filter((f) => f.Item_Name !== item.Item_Name)
      : [...favorites, item];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // ❤️ 喜歡 / 💔 不喜歡
  const handleLike = (item) => {
    if (!likedItems.some((i) => i.Item_Name === item.Item_Name))
      setLikedItems((prev) => [...prev, item]);
  };

  const handleDislike = (item) => {
    if (!dislikedItems.some((i) => i.Item_Name === item.Item_Name))
      setDislikedItems((prev) => [...prev, item]);
  };

  // ↩️ 反悔不喜歡
  const handleUndoDislike = () => {
    if (dislikedItems.length === 0) return;
    const last = dislikedItems[dislikedItems.length - 1];
    setDislikedItems((prev) => prev.slice(0, -1));
    alert(`已將「${last.Item_Name}」重新加入卡片堆 👀`);
  };

  // 🃏 剩餘卡片（用名稱比較）
  const remainingCards = useMemo(() => {
    return filteredItems.filter(
      (i) =>
        !likedItems.some((li) => li.Item_Name === i.Item_Name) &&
        !dislikedItems.some((di) => di.Item_Name === i.Item_Name)
    );
  }, [filteredItems, likedItems, dislikedItems]);

  // ✅ 全滑完後才顯示「已滑過」頁面（排除初次載入）
  useEffect(() => {
    if (
      allItems.length > 0 &&
      remainingCards.length === 0 &&
      (likedItems.length > 0 || dislikedItems.length > 0) &&
      viewMode === "cards"
    ) {
      const timer = setTimeout(() => setViewMode("swiped"), 500);
      return () => clearTimeout(timer);
    }
  }, [
    allItems.length,
    remainingCards.length,
    likedItems.length,
    dislikedItems.length,
    viewMode,
  ]);

  // 🌀 載入畫面
  if (loading)
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>載入中...</p>
      </div>
    );

  return (
    <div className="app">
      <HeaderBar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        viewMode={viewMode}
        setViewMode={setViewMode}
        likeCount={likedItems.length}
        dislikeCount={dislikedItems.length}
        favorites={favorites}
        setSearchQuery={setSearchQuery}
      />

      <main className="main-content">
        <div className="explore-section">
          {/* ==================== 變更點 1 ==================== */}
          {/* 加入 && !loading 判斷 */}
          {viewMode === "cards" && !loading && (
            <CardStack
              cards={remainingCards}
              likedItems={likedItems}
              dislikedItems={dislikedItems}
              onLike={handleLike}
              onDislike={handleDislike}
              favorites={favorites}
              onFavorite={handleFavorite}
              onUndoDislike={handleUndoDislike}
              showUndo={dislikedItems.length > 0}
            />
          )}

          {viewMode === "list" && (
            <ListView
              items={filteredItems}
              favorites={favorites}
              onToggleFavorite={handleFavorite}
            />
          )}

          {viewMode === "favorites" && (
            <FavoriteList favorites={favorites} onRemove={handleFavorite} />
          )}

          {viewMode === "swiped" && (
            <SwipedSummary
              likedItems={likedItems}
              dislikedItems={dislikedItems}
              allItems={allItems}
              onRestart={() => {
                setLikedItems([]);
                setDislikedItems([]);
                setViewMode("cards");
              }}
            />
          )}
        </div>

        {/* ✅ 右側推薦區 */}
        {/* ==================== 變更點 2 ==================== */}
        {/* 加入 && !loading 判斷 */}
        {viewMode === "cards" && !loading && (
          <LiveRecommendations
            likedItems={likedItems}
            allItems={allItems}
            favorites={favorites}
            onFavorite={handleFavorite}
          />
        )}
      </main>
    </div>
  );
}