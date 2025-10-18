// backend/server.js
const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// 明確欄位名稱
const csvHeaders = [
  'Shop_Name', 'Item_Name', 'Price', 'Stars', 'Comments',
  'Selling', 'Category', 'Cluster', 'Cluster_Name', 'Is_Suspicious'
];

const CSV_PATH = path.resolve(__dirname, '../data/processed_data_sample30.csv');

// ✅ 將 CSV 讀取抽成 Promise，避免重複讀檔
const readCSV = () => new Promise((resolve, reject) => {
  const results = [];
  if (!fs.existsSync(CSV_PATH)) return reject('Data file not found.');

  fs.createReadStream(CSV_PATH)
    .pipe(csv({ headers: csvHeaders, skipLines: 1 }))
    .on('data', (data) => {
      try {
        results.push({
          ...data,
          Price: parseFloat(data.Price) || 0,
          Stars: parseFloat(data.Stars) || 0,
          Comments: parseInt(data.Comments, 10) || 0,
          Selling: parseInt(data.Selling, 10) || 0,
          Cluster: parseInt(data.Cluster, 10) || 0,
          Is_Suspicious: data.Is_Suspicious?.toLowerCase() === 'true'
        });
      } catch (e) {
        console.warn('Skipped invalid row:', e.message);
      }
    })
    .on('end', () => resolve(results))
    .on('error', reject);
});

app.get('/api/items', async (req, res) => {
  try {
    const data = await readCSV();
    res.json(data);
  } catch (error) {
    console.error('Error loading CSV:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running → http://localhost:${PORT}`)
);
