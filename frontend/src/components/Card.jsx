import React, { useState } from "react";
import { CATEGORY_IMAGE_MAP } from "../utils/imageMap";
import "../App.css";

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

  const imageSrc =
    CATEGORY_IMAGE_MAP[item.Item_Name] ||
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
