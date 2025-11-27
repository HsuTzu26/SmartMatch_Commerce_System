import React, { useMemo } from "react";
import "../App.css";
import { CATEGORY_IMAGE_MAP } from "../utils/imageMap";

const clothingItems = [
  "純棉設計T恤",
  "修身牛仔褲",
  "防風連帽外套",
  "法式雪紡洋裝",
  "羊毛大衣",
  "圍巾",
];

const getCarbonFootprint = (itemName) => {
  if (!itemName) return null;

  // 3C 產品固定值
  if (itemName.includes("滑鼠")) return Math.floor(Math.random() * (200 - 80 + 1) + 80) + "kg";
  if (itemName.includes("耳機")) return Math.floor(Math.random() * (200 - 80 + 1) + 80) + "kg";
  if (itemName.includes("螢幕")) return "330kg";
  
  // 服飾固定值
  if (itemName.includes("鞋")) return "13.6kg";

  // 服飾類隨機值 (15~20kg)
  if (clothingItems.some((c) => itemName.includes(c))) {
    const randomValue = Math.floor(Math.random() * (20 - 15 + 1) + 15);
    return `${randomValue}kg`;
  }

  // 如果沒有匹配到，返回 null (不顯示標籤)
  return null;
};

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

    // 取出推薦商品後，直接在這裡計算並附加 carbonFootprint 數值
    // 這樣可以確保數值固定，不會因為組件重繪而一直變動
    return pool
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((item) => ({
        ...item,
        carbonFootprint: getCarbonFootprint(item.Item_Name),
      }));
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
              {/* --- 2. 顯示碳足跡標籤 --- */}
                {item.carbonFootprint && (
                  <div className="carbon-footprint-container" style={{ transform: 'scale(0.8)', margin: '0' }}> 
                    {/* 這裡加了 scale(0.8) 因為推薦卡片比較小，稍微縮小標籤比較好看 */}
                    <img
                      src="/CarbonFootprint_TaiwanEPA.jpeg"
                      alt="Carbon Footprint"
                    />
                    <span className="carbon-value">{item.carbonFootprint}</span>
                  </div>
                )}
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
