import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // 直接載入純 CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
