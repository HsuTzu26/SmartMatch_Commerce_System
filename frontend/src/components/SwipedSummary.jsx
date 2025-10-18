import React, { useMemo } from "react";
import "../App.css";
import { CATEGORY_IMAGE_MAP } from "../utils/imageMap";

export default function SwipedSummary({
  likedItems,
  dislikedItems,
  allItems,
  onRestart,
}) {
  // ✅ 計算每個類別的喜歡次數
  const categoryCount = useMemo(() => {
    const counts = {};
    likedItems.forEach((item) => {
      if (item.Cluster_Name) {
        counts[item.Cluster_Name] = (counts[item.Cluster_Name] || 0) + 1;
      }
    });
    return counts;
  }, [likedItems]);

  // ✅ 找出最高喜歡的類別（依照次數排序）
  const sortedCategories = useMemo(() => {
    return Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
  }, [categoryCount]);

  // ✅ 推薦邏輯：根據最常喜歡的類別依序推薦
  const recommended = useMemo(() => {
    if (sortedCategories.length === 0) return [];

    const pool = allItems.filter(
      (i) =>
        sortedCategories.includes(i.Cluster_Name) &&
        !likedItems.some((li) => li.Item_Name === i.Item_Name) &&
        !dislikedItems.some((di) => di.Item_Name === i.Item_Name)
    );

    // 排序時依據類別權重排序
    const weighted = pool.sort(
      (a, b) =>
        sortedCategories.indexOf(a.Cluster_Name) -
        sortedCategories.indexOf(b.Cluster_Name)
    );

    // 隨機抽取前 6 項
    return weighted.sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [sortedCategories, likedItems, dislikedItems, allItems]);

  const topReason = sortedCategories.length
    ? sortedCategories[0]
    : "多樣化商品";

  const getImage = (item) =>
    CATEGORY_IMAGE_MAP[item.Item_Name] ||
    `https://picsum.photos/seed/${item.Item_Name}/400/300`;

  return (
    <div className="swiped-summary-container">
      <h2>🎉 你已探索完所有商品！</h2>
      <p>看看你喜歡或不喜歡的商品 👇</p>

      {/* ❤️ 喜歡的商品 */}
      <div className="summary-section">
        <h3>❤️ 喜歡的商品 ({likedItems.length})</h3>
        <div className="summary-grid">
          {likedItems.map((item) => (
            <div key={item.Item_Name} className="summary-card liked">
              <img src={getImage(item)} alt={item.Item_Name} />
              <h4>{item.Item_Name}</h4>
              <p>${item.Price}</p>
            </div>
          ))}
          {likedItems.length === 0 && <p>（暫無喜歡的商品）</p>}
        </div>
      </div>

      {/* 💔 不喜歡的商品 */}
      <div className="summary-section">
        <h3>💔 不喜歡的商品 ({dislikedItems.length})</h3>
        <div className="summary-grid">
          {dislikedItems.map((item) => (
            <div key={item.Item_Name} className="summary-card disliked">
              <img src={getImage(item)} alt={item.Item_Name} />
              <h4>{item.Item_Name}</h4>
              <p>${item.Price}</p>
            </div>
          ))}
          {dislikedItems.length === 0 && <p>（暫無不喜歡的商品）</p>}
        </div>
      </div>

      {/* 🧠 智能推薦區塊 */}
      {recommended.length > 0 && (
        <div className="summary-section">
          <h3>✨ 為你精選推薦</h3>
          <p className="subtext">
            因為你喜歡 <span className="highlight-tag">{topReason}</span>，
            我們為你挑選了以下商品 💡
          </p>

          <div className="summary-grid">
            {recommended.map((item) => (
              <div key={item.Item_Name} className="summary-card recommended">
                <img src={getImage(item)} alt={item.Item_Name} />
                <h4>{item.Item_Name}</h4>
                <p>${item.Price}</p>
                <div className="tag">#{item.Cluster_Name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onRestart} className="restart-btn">
        🔁 再探索一次
      </button>
    </div>
  );
}
