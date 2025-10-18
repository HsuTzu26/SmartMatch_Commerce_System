import React from "react";
import { CATEGORY_IMAGE_MAP } from "../utils/imageMap";
import "../App.css";

export default function SwipedList({
  likedItems,
  dislikedItems,
  onUndoDislike,
}) {
  const renderItem = (item) => {
    const imageSrc =
      CATEGORY_IMAGE_MAP[item.Item_Name] ||
      `https://picsum.photos/seed/${item.Item_Name}/400/300`;

    return (
      <div key={item.Item_Name} className="swiped-item">
        <img
          src={imageSrc}
          alt={item.Item_Name}
          className="swiped-img"
          loading="lazy"
        />
        <div className="swiped-info">
          <h3>{item.Item_Name}</h3>
          <p className="shop-name">{item.Shop_Name}</p>
          <div className="meta">
            ⭐ {item.Stars?.toFixed(1) || "0"}・💬 {item.Comments || 0}・🔥{" "}
            {item.Selling || 0}
          </div>
          <div className="swiped-bottom">
            <span className="price-tag">${item.Price}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="swiped-list-container">
      <div className="undo-fixed">
        <button className="undo-btn" onClick={onUndoDislike}>
          ↩️ 反悔不喜歡
        </button>
      </div>

      {likedItems.length === 0 && dislikedItems.length === 0 ? (
        <p className="empty-msg">尚未有滑過的商品 🙈</p>
      ) : (
        <>
          {likedItems.length > 0 && (
            <section>
              <h2 className="swiped-section-title">💚 喜歡的商品</h2>
              <div className="swiped-grid">
                {likedItems.map(renderItem)}
              </div>
            </section>
          )}

          {dislikedItems.length > 0 && (
            <section>
              <h2 className="swiped-section-title">💔 不喜歡的商品</h2>
              <div className="swiped-grid">
                {dislikedItems.map(renderItem)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
