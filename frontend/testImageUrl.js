/**
 * 測試 Unsplash 圖片是否有效
 * 使用 Node.js 原生 fetch (Node 18+)
 */

export const CATEGORY_IMAGE_MAP = {
  // 3C產品
  "智慧型手機": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35b6?auto=format&fit=crop&w=800&q=80",
  "輕薄筆電": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  "降噪藍牙耳機": "https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=800&q=80",
  "27吋4K螢幕": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  "RGB機械鍵盤": "https://images.unsplash.com/photo-1611224885990-24c8ac8513f1?auto=format&fit=crop&w=800&q=80",
  "無線電競滑鼠": "https://images.unsplash.com/photo-1587206669206-8d5c2b20c7af?auto=format&fit=crop&w=800&q=80",

  // 服飾配件
  "純棉設計T恤": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
  "修身牛仔褲": "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80",
  "防風連帽外套": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
  "經典復古運動鞋": "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=800&q=80",
  "法式雪紡洋裝": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
  "羊毛大衣": "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80",

  // 時尚精品
  "抗UV飛行員太陽眼鏡": "https://images.unsplash.com/photo-1583224986204-1c5b5f4e62a7?auto=format&fit=crop&w=800&q=80",
  "真皮手提包": "https://images.unsplash.com/photo-1592878904946-b3cd8a48e1c7?auto=format&fit=crop&w=800&q=80",
  "三眼計時腕錶": "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?auto=format&fit=crop&w=800&q=80",
  "手工編織皮夾": "https://images.unsplash.com/photo-1600185365014-8066a0f69805?auto=format&fit=crop&w=800&q=80",
  "絲質印花圍巾": "https://images.unsplash.com/photo-1570989044510-df7cb0c2a0da?auto=format&fit=crop&w=800&q=80",
  "設計師款棒球帽": "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=800&q=80",

  // 圖書文具
  "暢銷懸疑小說": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
  "精裝版商業理財聖經": "https://images.unsplash.com/photo-1573496529574-be85d6a60704?auto=format&fit=crop&w=800&q=80",
  "心靈成長勵志書": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea?auto=format&fit=crop&w=800&q=80",
  "米其林主廚食譜": "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80",
  "限量版漫畫套書": "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?auto=format&fit=crop&w=800&q=80",
  "多益高分單字書": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
};


async function checkImage(url, name) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (res.ok) {
      console.log(`✅ [200] ${name} → ${url}`);
    } else {
      console.warn(`⚠️ [${res.status}] ${name} → ${url}`);
    }
  } catch (err) {
    console.error(`❌ Error fetching ${name}: ${err.message}`);
  }
}

(async () => {
  console.log("🔍 開始檢查圖片連結...\n");
  for (const [name, url] of Object.entries(CATEGORY_IMAGE_MAP)) {
    await checkImage(url, name);
  }
})();
