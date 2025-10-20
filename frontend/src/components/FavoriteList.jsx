import React from "react";
import { CATEGORY_IMAGE_MAP } from "../utils/imageMap";
import "../App.css";

export default function FavoriteList({ favorites, onRemove }) {
  if (!favorites || favorites.length === 0)
    return <p className="empty-msg">收藏清單空空如也 😢</p>;

  return (
    <div className="favorites-grid">
      {favorites.map((item) => {
        const matchedKey = Object.keys(CATEGORY_IMAGE_MAP).find((key) =>
          item.Item_Name.includes(key)
        );

        const imageSrc =
          (matchedKey && CATEGORY_IMAGE_MAP[matchedKey]) ||
          `https://picsum.photos/seed/${encodeURIComponent(item.Item_Name)}/600/400`;


        return (
          <div key={item.Item_Name} className="favorite-item">
            {/* 圖片 */}
            <img
              src={imageSrc}
              alt={item.Item_Name}
              className="favorite-img"
              loading="lazy"
            />

            {/* 商品資訊 */}
            <div className="favorite-info">
              <h3>{item.Item_Name}</h3>
              <p className="shop-name">{item.Shop_Name}</p>

              <div className="meta">
                ⭐ {item.Stars?.toFixed(1) || "0"}・💬 {item.Comments || 0}・🔥{" "}
                {item.Selling || 0}
              </div>

              <div className="favorite-bottom">
                <span className="price-tag">${item.Price}</span>
                <button
                  className="remove-btn"
                  onClick={() => onRemove(item)}
                >
                  ❌ 取消收藏
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
