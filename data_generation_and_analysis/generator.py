import os
import random
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from faker import Faker
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# 初始化 Faker
fake = Faker('zh_TW')

# 電商平台列表
ECOMMERCE_PLATFORMS = ['PChome 24h購物', 'momo購物網', '蝦皮商城', 'YAHOO奇摩', 'Amazon亞馬遜']

# 商品類別、品項與價格區間
CATEGORIES = {
    '3C產品': {
        'items': ['智慧型手機', '輕薄筆電', '降噪藍牙耳機', '27吋4K螢幕', 'RGB機械鍵盤', '無線電競滑鼠'],
        'price_range': (3000, 80000)
    },
    '服飾配件': {
        'items': ['純棉設計T恤', '修身牛仔褲', '防風連帽外套', '經典復古運動鞋', '法式雪紡洋裝', '羊毛大衣'],
        'price_range': (500, 6000)
    },
    '時尚精品': {
        'items': ['抗UV飛行員太陽眼鏡', '真皮手提包', '三眼計時腕錶', '手工編織皮夾', '絲質印花圍巾', '設計師款棒球帽'],
        'price_range': (1200, 25000)
    },
    '圖書文具': {
        'items': ['暢銷懸疑小說', '精裝版商業理財聖經', '心靈成長勵志書', '米其林主廚食譜', '限量版漫畫套書', '多益高分單字書'],
        'price_range': (250, 2200)
    }
}


def generate_fake_data(num_records=200):
    """生成指定數量的假商品資料，並以隨機比例刻意加入可疑資料"""
    data = []
    suspicious_items_generated = 0
    
    suspicious_ratio = random.uniform(0.05, 0.25)
    print(f"--- Data Generation ---")
    print(f"This run will use a random suspicious item ratio of {suspicious_ratio:.2%}.")

    for _ in range(num_records):
        platform = random.choice(ECOMMERCE_PLATFORMS)
        category_name = random.choice(list(CATEGORIES.keys()))
        category_info = CATEGORIES[category_name]
        item_base_name = random.choice(category_info['items'])
        price_min, price_max = category_info['price_range']
        item_name = f"{fake.company()} {item_base_name}"
        price = round(random.uniform(price_min, price_max), 0)

        if random.random() < suspicious_ratio: 
            stars = 5.0
            comments = random.randint(1, 9)
            selling = comments * random.randint(1, 3) + random.randint(0, 10)
            
            if random.random() < 0.5 and category_name != '圖書文具':
                 price = round(random.uniform(price_min * 0.1, price_min * 0.5), 0)
            
            suspicious_items_generated += 1
        else:
            stars = round(random.uniform(3.8, 4.9), 1)
            base_popularity = random.randint(10, 1500)
            comments = base_popularity + random.randint(-int(base_popularity*0.3), int(base_popularity*0.3))
            selling = int(base_popularity * random.uniform(2, 6)) + random.randint(1, 200)

        comments = max(1, comments)
        selling = max(1, selling)
        data.append([platform, item_name, price, stars, comments, selling, category_name])
    
    print(f"Intentionally generated {suspicious_items_generated} suspicious items (using various patterns).")
    
    columns = ['Shop_Name', 'Item_Name', 'Price', 'Stars', 'Comments', 'Selling', 'Category']
    df = pd.DataFrame(data, columns=columns)
    return df

def analyze_and_process(df, results_dir, num_records):
    """對生成的資料進行分析與處理，並將分群結果視覺化"""
    features_for_clustering = df[['Price', 'Selling', 'Comments', 'Stars']]
    scaler = StandardScaler()
    features_scaled = scaler.fit_transform(features_for_clustering)
    kmeans = KMeans(n_clusters=8, random_state=42, n_init='auto')
    df['Cluster'] = kmeans.fit_predict(features_scaled)

    cluster_analysis = df.groupby('Cluster').agg(
        Avg_Price=('Price', 'mean'),
        Main_Category=('Category', lambda x: x.mode()[0])
    ).reset_index()

    price_median = df['Price'].median()
    cluster_name_map = {}
    for index, row in cluster_analysis.iterrows():
        price_prefix = "高價" if row['Avg_Price'] > price_median else "平價"
        cluster_name = f"{price_prefix}{row['Main_Category']}"
        cluster_name_map[row['Cluster']] = cluster_name
    
    df['Cluster_Name'] = df['Cluster'].map(cluster_name_map)
    print("--- Cluster Naming ---")
    print(cluster_analysis)
    print("Generated Cluster Names:", cluster_name_map)
    print(f"--- Data Analysis ---")
    print(f"Clustering complete. Identified {kmeans.n_clusters} clusters.")

    # --- 重要修正：將 Is_Suspicious 改回 Is Suspicious ---
    df['Is Suspicious'] = False
    rule_A = (df['Comments'] < 10) & (df['Stars'] == 5.0)
    df.loc[rule_A, 'Is Suspicious'] = True
    cluster_price_stats = df.groupby('Cluster')['Price'].agg(['mean', 'std']).rename(columns={'mean': 'Cluster_Price_Mean', 'std': 'Cluster_Price_Std'})
    df = df.merge(cluster_price_stats, on='Cluster', how='left')
    df['Cluster_Price_Std'].fillna(0, inplace=True)
    rule_B = (df['Price'] < (df['Cluster_Price_Mean'] - 3 * df['Cluster_Price_Std'])) & (df['Price'] > 0)
    df.loc[rule_B, 'Is Suspicious'] = True
    df['Sales_Comment_Ratio'] = df.apply(lambda row: row['Selling'] / row['Comments'] if row['Comments'] > 0 else np.inf, axis=1)
    q1, q3 = df['Sales_Comment_Ratio'].quantile(0.25), df['Sales_Comment_Ratio'].quantile(0.75)
    iqr = q3 - q1
    upper_bound = q3 + 1.5 * iqr
    rule_C = (df['Sales_Comment_Ratio'] > upper_bound) | (df['Sales_Comment_Ratio'] == np.inf)
    df.loc[rule_C, 'Is Suspicious'] = True
    df.drop(columns=['Cluster_Price_Mean', 'Cluster_Price_Std', 'Sales_Comment_Ratio'], inplace=True)
    print(f"Successfully flagged {df['Is Suspicious'].sum()} suspicious items using multiple rules.")
    
    # --- 修正後的繪圖區塊 ---
    os.makedirs(results_dir, exist_ok=True)

    # 圖一：儲存未圈選的原始分群圖
    plt.figure(figsize=(12, 8))
    scatter = plt.scatter(df['Price'], df['Selling'], c=df['Cluster'], cmap='viridis', s=50, alpha=0.7)
    plt.title(f'K-Means Clustering of Products (Sample Size: {num_records})')
    plt.xlabel('Price')
    plt.ylabel('Selling')
    plt.colorbar(scatter, label='Cluster ID')
    plt.grid(True, linestyle='--', alpha=0.6)
    plot_path_simple = os.path.join(results_dir, f'kmeans_clustering_simple_{num_records}.png')
    plt.savefig(plot_path_simple)
    plt.close()
    print(f"Simple clustering plot saved to {plot_path_simple}")

    # 圖二：儲存有圈選可疑商品的圖
    plt.figure(figsize=(12, 8))
    scatter = plt.scatter(df['Price'], df['Selling'], c=df['Cluster'], cmap='viridis', s=50, alpha=0.7)
    suspicious_df = df[df['Is Suspicious']]
    if not suspicious_df.empty:
        plt.scatter(suspicious_df['Price'], suspicious_df['Selling'], 
                    facecolors='none', edgecolors='red', s=200, linewidth=2, label='Suspicious Item (Flagged)', alpha=0.9)
    plt.title(f'K-Means Clustering (Sample Size: {num_records}) with Suspicious Items Highlighted')
    plt.xlabel('Price')
    plt.ylabel('Selling')
    plt.colorbar(scatter, label='Cluster ID')
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.6)
    plot_path_highlighted = os.path.join(results_dir, f'kmeans_clustering_highlighted_{num_records}.png')
    plt.savefig(plot_path_highlighted)
    plt.close()
    print(f"Clustering plot with suspicious items saved to {plot_path_highlighted}")
    # --- 繪圖區塊結束 ---

    return df

def main():
    """主執行函式"""
    num_records=30
    # 使用 os.path.join 來建立路徑，更具彈性且避免反斜線問題
    base_dir = r"D:\_work\_codeDev\Project\ecommerce-analyzer"
    data_dir = os.path.join(base_dir, "data")
    analyze_results_dir = os.path.join(base_dir, "analyze_results")

    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(analyze_results_dir, exist_ok=True)

    data_output_path = os.path.join(data_dir, f'processed_data_sample{num_records}.csv')

    raw_df = generate_fake_data(num_records=num_records)
    processed_df = analyze_and_process(raw_df, analyze_results_dir, num_records)
    
    processed_df.to_csv(data_output_path, index=False, encoding='utf-8-sig')
    print(f"\nProcessed data with Cluster Names saved to {data_output_path}")

if __name__ == '__main__':
    main()