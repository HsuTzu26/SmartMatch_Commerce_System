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

export default function ListView({ items, favorites, onToggleFavorite }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3); // 預設顯示 10 筆

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const slice = items.slice(startIndex, startIndex + itemsPerPage);
    
    // 這裡進行 map，為每個商品加上固定的碳足跡數值
    return slice.map(item => ({
      ...item,
      carbonFootprint: getCarbonFootprint(item.Item_Name)
    }));
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
                {/* 將價格與碳足跡放在同一行顯示 */}
                <div className="price-row" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '8px' }}>
                  <p className="price" style={{ margin: 0 }}>💰 ${item.Price}</p>
                  
                  {/* --- 3. 顯示碳足跡標籤 --- */}
                  {/* 直接讀取 item.carbonFootprint */}
                  {item.carbonFootprint && (
                    <div className="carbon-footprint-container" style={{ margin: 0 }}> 
                      <img
                        src="/CarbonFootprint_TaiwanEPA.jpeg"
                        alt="Carbon Footprint Label"
                      />
                      <span className="carbon-value">{item.carbonFootprint}</span>
                    </div>
                  )}
                  {/* ----------------------- */}
                </div>
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
