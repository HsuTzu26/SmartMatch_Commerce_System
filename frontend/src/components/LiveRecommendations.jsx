import React, { useMemo } from "react";
import "../App.css";
import { CATEGORY_IMAGE_MAP } from "../utils/imageMap";

export default function LiveRecommendations({ likedItems, allItems, favorites, onFavorite }) {
  // 統計類別權重
  const categoryCount = useMemo(() => {
    const counts = {};
    likedItems.forEach((item) => {
      if (item.Cluster_Name) {
        counts[item.Cluster_Name] = (counts[item.Cluster_Name] || 0) + 1;
      }
    });
    return counts;
  }, [likedItems]);

  const sortedCategories = useMemo(() => {
    return Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .map(([c]) => c);
  }, [categoryCount]);

  // 推薦邏輯
  const recommended = useMemo(() => {
    if (sortedCategories.length === 0) return [];

    const pool = allItems.filter(
      (i) =>
        sortedCategories.includes(i.Cluster_Name) &&
        !likedItems.some((li) => li.Item_Name === i.Item_Name)
    );

    return pool.sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [sortedCategories, likedItems, allItems]);

  if (recommended.length === 0) return null;

  const isFavorited = (item) =>
    favorites.some((f) => f.Item_Name === item.Item_Name);

  const getImage = (item) =>
    CATEGORY_IMAGE_MAP[item.Item_Name] ||
    `https://picsum.photos/seed/${item.Item_Name}/300/200`;

  return (
    <aside className="live-recommendation-panel">
      <h3>🧠 即時推薦</h3>
      <p className="recommend-reason">
        因為你喜歡{" "}
        <span className="highlight-tag">{sortedCategories[0] || "多樣化商品"}</span>，
        你可能也會喜歡 👇
      </p>

      <div className="recommend-grid">
        {recommended.map((item) => (
          <div key={item.Item_Name} className="recommend-card">
            <img src={getImage(item)} alt={item.Item_Name} />
            <h4>{item.Item_Name}</h4>
            <p className="price">💰 ${item.Price}</p>
            <span className="tag">#{item.Cluster_Name}</span>

            <button
              className={`fav-btn ${isFavorited(item) ? "active" : ""}`}
              onClick={() => onFavorite(item)}
            >
              {isFavorited(item) ? "💛 已收藏" : "⭐ 收藏"}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
