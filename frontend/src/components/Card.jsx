import React, { useState, useMemo } from "react";
import { CATEGORY_IMAGE_MAP } from "../utils/imageMap";
import "../App.css";

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

export default function Card({
  item,
  index,
  isTop,
  onLike,
  onDislike,
  isFavorited,
  onFavorite,
}) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeType, setSwipeType] = useState(null);

  // 使用 useMemo 計算碳足跡，避免每次 render 都重新計算隨機值
  const footprintValue = useMemo(
    () => getCarbonFootprint(item.Item_Name),
    [item.Item_Name]
  );

  const handleMouseDown = (e) => {
    if (e.target.tagName !== "IMG") return;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) setDragX((prev) => prev + e.movementX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX > 120) {
      setSwipeType("like");
      onLike();
    } else if (dragX < -120) {
      setSwipeType("dislike");
      onDislike();
    } else {
      setDragX(0);
      setSwipeType(null);
    }
  };

  const matchedKey = Object.keys(CATEGORY_IMAGE_MAP).find((key) =>
    item.Item_Name.includes(key)
  );

  const imageSrc =
    (matchedKey && CATEGORY_IMAGE_MAP[matchedKey]) ||
    `https://picsum.photos/seed/${encodeURIComponent(item.Item_Name)}/600/400`;

  return (
    <div
      className={`card ${isTop ? "top-card" : ""}`}
      style={{
        transform: `translateX(${dragX}px) rotate(${dragX / 10}deg)`,
        zIndex: isTop ? 100 : index,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img src={imageSrc} alt={item.Item_Name} className="card-img" />

      {swipeType && (
        <div className={`swipe-indicator ${swipeType}`}>
          {swipeType === "like" ? "❤️ 喜歡" : "💔 不喜歡"}
        </div>
      )}

      <div className="card-info">
        <h3>{item.Item_Name}</h3>
        <p className="shop-name">{item.Shop_Name}</p>
        <div className="meta">
          ⭐ {item.Stars?.toFixed(1) || "0"}・💬 {item.Comments || 0}・🔥{" "}
          {item.Selling || 0}
        </div>

        <div className="card-bottom">
          <span className="price-tag">💰 ${item.Price}</span>
          {/* --- 新增：碳足跡標籤 --- */}
          {footprintValue && (
            <div className="carbon-footprint-container">
              {/* 假設圖片放在 public 資料夾根目錄 */}
              <img
                src="/CarbonFootprint_TaiwanEPA.jpeg"
                alt="Carbon Footprint Label"
              />
              <span className="carbon-value">{footprintValue}</span>
            </div>
          )}
          {/* ----------------------- */}
          <button
            className={`favorite-btn ${isFavorited ? "active" : ""}`}
            onClick={onFavorite}
          >
            {isFavorited ? "💛 已收藏" : "⭐ 收藏"}
          </button>
        </div>
      </div>
    </div>
  );
}
