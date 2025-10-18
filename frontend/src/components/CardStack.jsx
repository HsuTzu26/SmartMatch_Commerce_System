import React, { useState, useMemo, useEffect } from "react";
import Card from "./Card";
import "../App.css";

export default function CardStack({
  cards,
  likedItems,
  dislikedItems,
  onLike,
  onDislike,
  favorites,
  onFavorite,
  onUndoDislike,
  showUndo,
}) {
  const [currentIndex, setCurrentIndex] = useState(cards.length - 1);

  useEffect(() => {
    setCurrentIndex(cards.length - 1);
  }, [cards]);

  const visibleCards = useMemo(() => {
    return cards.slice(Math.max(currentIndex - 2, 0), currentIndex + 1);
  }, [cards, currentIndex]);

  if (!cards || cards.length === 0) {
    return (
      <div className="empty-card-msg">
        <p>😢 此分類目前沒有商品</p>
      </div>
    );
  }

  return (
    <div className="card-stack-container">
      <div className="card-stack">
        {visibleCards.map((item, i) => {
          const depth = visibleCards.length - i - 1;
          const scale = 1 - depth * 0.04;
          const offsetY = depth * 15;

          return (
            <div
              key={item.Item_Name}
              className="card-wrapper"
              style={{
                transform: `scale(${scale}) translateY(${offsetY}px)`,
                zIndex: 100 - depth,
              }}
            >
              <Card
                item={item}
                index={i}
                isTop={i === visibleCards.length - 1}
                onLike={() => {
                  onLike(item);
                  setCurrentIndex((prev) => Math.max(prev - 1, 0));
                }}
                onDislike={() => {
                  onDislike(item);
                  setCurrentIndex((prev) => Math.max(prev - 1, 0));
                }}
                isFavorited={favorites.some(
                  (f) => f.Item_Name === item.Item_Name
                )}
                onFavorite={() => onFavorite(item)}
              />
            </div>
          );
        })}
      </div>

      {/* ❤️💔 喜歡 / 不喜歡 */}
      <div className="swipe-btn-group">
        <button className="dislike-btn" onClick={() => onDislike(cards[currentIndex])}>
          💔
        </button>
        <button className="like-btn" onClick={() => onLike(cards[currentIndex])}>
          ❤️
        </button>
      </div>

      {showUndo && (
        <div className="undo-container">
          <button onClick={onUndoDislike} className="undo-btn">
            ↩️ 反悔不喜歡
          </button>
        </div>
      )}
    </div>
  );
}
