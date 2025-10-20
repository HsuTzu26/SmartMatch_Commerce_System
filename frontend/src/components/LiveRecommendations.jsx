import React, { useMemo } from "react";
import "../App.css";
import { CATEGORY_IMAGE_MAP } from "../utils/imageMap";

export default function LiveRecommendations({ likedItems, allItems, favorites, onFavorite }) {
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

  const recommended = useMemo(() => {
    if (sortedCategories.length === 0) return [];

    const pool = allItems.filter(
      (i) =>
        sortedCategories.includes(i.Cluster_Name) &&
        !likedItems.some((li) => li.Item_Name === i.Item_Name)
    );

    return pool.sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [sortedCategories, likedItems, allItems]);

  if (recommended.length === 0) return null;

  const isFavorited = (item) =>
    favorites.some((f) => f.Item_Name === item.Item_Name);

  const getImage = (item) => {
    // 找到第一個 key 被 item.Item_Name 包含的圖片
    const matchedKey = Object.keys(CATEGORY_IMAGE_MAP).find((key) =>
      item.Item_Name.includes(key)
    );

    // 如果找到就用對應圖片，否則 fallback
    return matchedKey
      ? CATEGORY_IMAGE_MAP[matchedKey]
      : `https://picsum.photos/seed/${encodeURIComponent(item.Item_Name)}/400/300`;
  };

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
            <img src={getImage(item)} alt={item.Item_Name} className="recommend-img" />
            <div className="recommend-info">
              <h4>{item.Item_Name}</h4>
              <p className="meta">
                ⭐ {item.Stars?.toFixed(1) || "0"}・💬 {item.Comments || 0}
              </p>
              <p className="price">💰 ${item.Price}</p>
              <p className="cluster">#{item.Cluster_Name}</p>
            </div>

            <button
              className={`recommend-fav-btn ${isFavorited(item) ? "active" : ""}`}
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
