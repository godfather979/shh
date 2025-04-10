from flask import Flask, jsonify, request
import requests
from GoogleNews import GoogleNews
import pandas as pd
from fake_useragent import UserAgent
from newspaper import Article
import nltk
import time
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Download required NLTK data for newspaper
try:
    nltk.download('punkt_tab', quiet=True)
except Exception as e:
    print(f"Warning: NLTK download failed: {e}")

def fetch_news(keyword, min_results=10):
    """Fetch news articles with all original Google News columns"""
    googlenews = GoogleNews(lang='en', region='US', period='7d', encode='utf-8')
    googlenews.search(keyword)
    
    all_results = []
    page = 1
    max_pages = 10
    
    while len(all_results) < min_results and page <= max_pages:
        if page > 1:
            googlenews.getpage(page)
        
        results = googlenews.result(sort=True)
        if not results:
            break
            
        all_results.extend(results)
        page += 1
        time.sleep(1)
    
    news_data_df = pd.DataFrame.from_dict(all_results)
    if not news_data_df.empty:
        news_data_df["link"] = news_data_df["link"].apply(
            lambda url: url.split("&ved")[0] if isinstance(url, str) else url
        )
        news_data_df = news_data_df.drop_duplicates(subset=['link'])
    
    return news_data_df

def extract_article_content(url, ua, max_retries=2):
    """Extract article content with summary and keywords using newspaper"""
    if not isinstance(url, str) or not url.startswith("http"):
        return None
    
    for attempt in range(max_retries):
        try:
            article = Article(url)
            article.download()
            article.parse()
            
            # Enable NLP features
            try:
                article.nlp()
            except Exception as e:
                print(f"NLP processing failed: {e}")
                return None
            
            # Return summary and keywords if successful
            if article.summary and article.keywords:
                return {
                    'summary': article.summary.strip(),
                    'keywords': ', '.join(article.keywords)
                }
            
        except Exception as e:
            if attempt < max_retries - 1:
                delay = 1 + random.uniform(0, 1)
                time.sleep(delay)
            continue
    
    return None

def process_news(keyword, min_results=10):
    """Process news articles and return as list of dictionaries"""
    ua = UserAgent()
    processed_articles = []
    attempts = 0
    max_attempts = 3
    
    while len(processed_articles) < min_results and attempts < max_attempts:
        # Fetch news data with all columns
        news_data_df = fetch_news(keyword, min_results * 2)
        
        if news_data_df.empty:
            break
        
        # Process each article
        for _, row in news_data_df.iterrows():
            if len(processed_articles) >= min_results:
                break
            
            news_link = row['link']
            article_data = extract_article_content(news_link, ua)
            
            if article_data:
                # Combine original Google News data with extracted content
                article_info = {
                    'title': row['title'],
                    'link': news_link,
                    'description': row.get('desc', ''),
                    'datetime': row.get('datetime', ''),
                    'media': row.get('media', ''),
                    'summary': article_data['summary'],
                    'keywords': article_data['keywords']
                }
                processed_articles.append(article_info)
            
            time.sleep(random.uniform(0.5, 1))
        
        attempts += 1
        
        if len(processed_articles) < min_results:
            time.sleep(3)
    
    return processed_articles

@app.route('/api/news', methods=['GET'])
def get_news():
    """API endpoint to fetch news articles"""
    try:
        # Get parameters from request
        keyword = request.args.get('keyword', 'Indian law')
        min_results = int(request.args.get('min_results', 20))
        
        # Validate parameters
        if min_results <= 0:
            return jsonify({'error': 'min_results must be greater than 0'}), 400
        if not keyword:
            return jsonify({'error': 'keyword is required'}), 400
        
        # Process news articles
        print(f"Fetching news for keyword: {keyword}")
        articles = process_news(keyword, min_results)
        print(f"Total articles found: {len(articles)}")
        
        # Prepare response
        response = {
            'status': 'success',
            'keyword': keyword,
            'total_articles': len(articles),
            'articles': articles
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8001)