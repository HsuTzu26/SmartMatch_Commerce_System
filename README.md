電商商品滑動瀏覽器 (E-commerce Product Swiper)
這是一個全端應用程式專案，旨在展示一個完整的數據處理流程：從數據生成、分析處理，到後端 API 服務，最終由前端以互動式的卡片滑動介面呈現給使用者。

專案簡介 (Project Overview)
本專案模擬了一個電商數據分析與展示的場景。首先，一個 Python 腳本會生成來自五家不同知名電商平台的擬真商品資料。接著，此腳本會對資料進行初步的分析，例如透過機器學習進行分群，並標記出潛在的異常資料。處理完成的數據會由一個 Node.js 後端伺服器讀取，並透過 REST API 提供服務。最後，一個 React 前端應用會獲取這些資料，並以類似 Tinder 的卡片滑動介面讓使用者瀏覽、篩選商品。

主要功能 (Key Features)
動態假資料生成: 使用 Python 的 Faker 和 random 套件生成涵蓋 5 家電商平台（PChome, momo, 蝦皮等）的擬真商品數據。

數據分析與處理:

使用 scikit-learn 對商品進行 K-Means 分群。

實現一個簡單的異常偵測邏輯，標記出可疑的商品評論。

高效後端服務: 使用 Node.js 和 Express 建立輕量級後端，讀取處理好的 CSV 檔案並以 JSON 格式提供 API。

互動式前端介面:

使用 React 打造的單頁應用程式 (SPA)。

採用 react-tinder-card 實現流暢的卡片滑動效果。

多種操作方式:

滑鼠: 可直接拖曳卡片向左（不喜歡）或向右（喜歡）。

鍵盤: 支援使用 ← 和 → 方向鍵進行操作。

點擊: 可點擊畫面下方的按鈕來表達偏好。

即時反饋: 畫面上會即時顯示使用者已「喜歡」和「不喜歡」的商品數量。

技術棧 (Technology Stack)
數據生成與分析:
*

Pandas: 資料處理與操作。

Scikit-learn: 用於 K-Means 分群。

Faker: 生成擬真的假資料。

後端:
*

Express.js: 搭建 API 伺服器。

CORS: 處理跨域請求。

csv-parser: 解析 CSV 檔案。

前端:
*

Axios: 發送 API 請求。

react-tinder-card: 實現卡片滑動互動。

檔案架構 (File Structure)
ecommerce-analyzer/
├── data/
│   └── processed_data.csv          # 由 Python 腳本生成與處理後的最終資料
├── data_generation_and_analysis/
│   └── generator.py                # Python 腳本，用於生成假資料並進行分析
├── backend/
│   ├── node_modules/
│   ├── package.json
│   └── server.js                   # Node.js Express API 伺服器
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.css                 # 前端應用的主要樣式
│   │   └── App.js                  # 主要的 React 元件，包含所有互動邏輯
│   ├── node_modules/
│   └── package.json
├── venv/                           # Python 虛擬環境
└── README.md                       # 本說明文件