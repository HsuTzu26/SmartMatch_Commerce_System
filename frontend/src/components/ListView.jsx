import React from "react";
import { CATEGORY_IMAGE_MAP } from "../utils/imageMap";
import "../App.css";

export default function ListView({ items, favorites, onToggleFavorite }) {
  if (!items || items.length === 0) {
    return <p className="empty-msg">此分類暫無商品 😢</p>;
  }

  return (
    <div className="list-view">
      {items.map((item) => {
        const imageSrc =
          CATEGORY_IMAGE_MAP[item.Item_Name] ||
          `https://picsum.photos/seed/${item.Item_Name}/400/300`;

        const isFavorited = favorites.some(
          (f) => f.Item_Name === item.Item_Name
        );

        return (
          <div key={item.Item_Name} className="list-item">
            {/* 商品圖片 */}
            <img
              src={imageSrc}
              alt={item.Item_Name}
              className="list-img"
              loading="lazy"
            />

            {/* 商品資訊 */}
            <div className="list-info">
              <h3>{item.Item_Name}</h3>
              <p className="shop-name">{item.Shop_Name}</p>

              <div className="meta">
                ⭐ {item.Stars?.toFixed(1) || "0"}・💬 {item.Comments || 0}・🔥{" "}
                {item.Selling || 0}
              </div>

              <div className="list-bottom">
                <span className="price-tag">${item.Price}</span>
                <button
                  className={`favorite-btn ${isFavorited ? "active" : ""}`}
                  onClick={() => onToggleFavorite(item)}
                >
                  {isFavorited ? "💛 已收藏" : "⭐ 收藏"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
