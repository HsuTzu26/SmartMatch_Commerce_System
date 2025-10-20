import React, { useState, useMemo } from "react";
import { CATEGORY_IMAGE_MAP } from "../utils/imageMap";
import "../App.css";

export default function ListView({ items, favorites, onToggleFavorite }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3); // 預設顯示 10 筆

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleChangePageSize = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setItemsPerPage(value);
      setCurrentPage(1);
    }
  };

  if (!items || items.length === 0) {
    return <p className="empty-msg">目前沒有符合條件的商品 😢</p>;
  }

  return (
    <div className="list-view-container">
      {/* === 上方控制列 === */}
      <div className="list-header">
        <div className="page-size-selector">
          <label>每頁顯示：</label>
          <input
            type="number"
            value={itemsPerPage}
            onChange={handleChangePageSize}
            min="1"
            className="page-size-input"
          />
          <span> 筆</span>
        </div>
      </div>

      {/* === 商品清單 === */}
      <div className="list-view">
        {currentItems.map((item) => {
          const matchedKey = Object.keys(CATEGORY_IMAGE_MAP).find((key) =>
            item.Item_Name.includes(key)
          );

          const imageSrc =
            (matchedKey && CATEGORY_IMAGE_MAP[matchedKey]) ||
            `https://picsum.photos/seed/${encodeURIComponent(item.Item_Name)}/600/400`;

          const isFav = favorites.some((f) => f.Item_Name === item.Item_Name);

          return (
            <div key={item.Item_Name} className="list-item">
              <img src={imageSrc} alt={item.Item_Name} className="list-img" />
              <div className="list-info">
                <h4>{item.Item_Name}</h4>
                <p className="shop-name">{item.Shop_Name}</p>
                <p className="meta">
                  ⭐ {item.Stars?.toFixed(1) || "0"}・💬 {item.Comments || 0}・🔥{" "}
                  {item.Selling || 0}
                </p>
                <p className="price">💰 ${item.Price}</p>
              </div>

              <button
                className={`favorite-btn ${isFav ? "active" : ""}`}
                onClick={() => onToggleFavorite(item)}
              >
                {isFav ? "💛 已收藏" : "⭐ 收藏"}
              </button>
            </div>
          );
        })}
      </div>

      {/* === 分頁控制 === */}
      <div className="pagination-bar">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ⬅️ 上一頁
        </button>

        {/* 數字按鈕 */}
        <div className="page-numbers">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-btn ${page === currentPage ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          下一頁 ➡️
        </button>
      </div>
    </div>
  );
}
