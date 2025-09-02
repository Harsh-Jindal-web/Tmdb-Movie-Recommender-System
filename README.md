# 🎬 TMDb Movie Recommender System

A personalized, intelligent, and explainable movie recommendation system built using **FastAPI**, **Machine Learning**, **OpenAI GPT**, and a custom **frontend**.

> 🚀 Developed under the **Minor in AI** program by **IIT Ropar**

---

## 📌 Features

- 🎯 **Content-based recommendations** using TF-IDF and cosine similarity
- 🧠 **GPT-powered natural language explanations** (via Azure OpenAI)
- 🔍 **Supports natural language queries** (e.g., “show me sci-fi movies like Interstellar”)
- ❤️ **Tracks likes/dislikes and personalizes future suggestions**
- 🎨 **Posters, genres, ratings, and metadata** from TMDb API
- 🔗 Modular **FastAPI backend** and a lightweight **React-based frontend**

---

## 🛠️ Tech Stack

| Layer       | Tools / Frameworks                             |
|------------|------------------------------------------------|
| Frontend   | React, Vite, Axios                             |
| Backend    | FastAPI, Scikit-learn, Pandas, OpenAI API      |
| AI Model   | TF-IDF, Cosine Similarity, GPT-3.5 Turbo (Azure) |
| Data Source| TMDb API, TMDb 5000 Movies Dataset             |

---

## ⚙️ How to Run

### 📦 Backend Setup (FastAPI)

1. **Install dependencies:**

```bash
pip install -r requirements.txt
```

2. **Run the server:**

```bash
uvicorn app.main:app --reload --port 8000
```

Backend available at: http://localhost:8000  
Docs available at: http://localhost:8000/docs

---

### 🌐 Frontend Setup (React)

1. **Install dependencies:**

```bash
npm install
```

2. **Start the development server:**

```bash
npm run dev
```

Frontend runs at: http://localhost:5173

---

### 🧠 Configuration

Add the following to config.py to connect with Azure OpenAI:

```python
import openai

# OpenAI / Azure Setup
OPENAI_API_TYPE = ""
OPENAI_API_BASE = ""
OPENAI_API_VERSION = ""
OPENAI_DEPLOYMENT_NAME = ""
AZURE_DEPLOYMENT_NAME = ""
OPENAI_API_KEY = ""
OPENAI_API_EMBEDDING = ""

openai.api_type = OPENAI_API_TYPE
openai.api_base = OPENAI_API_BASE
openai.api_version = OPENAI_API_VERSION
openai.api_key = OPENAI_API_KEY
```

---

### 🎞️ TMDb Integration

In `tmdb.py`, configure TMDb API like this:

```python
# TMDb API Key Setup
TMDB_API_KEY = "your_tmdb_api_key"

# Optional: Configure retry-enabled session for better reliability
```

---

## 📂 Project Structure

```bash
├── app/
│   ├── main.py              # FastAPI entry point
│   ├── recommender.py       # Recommendation engine logic
│   ├── user.py              # User history and feedback handling
│   ├── tmdb.py              # TMDb integration
│   └── config.py            # API keys and configurations
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
├── requirements.txt
├── README.md
```

---

## 📈 Future Improvements

- Add collaborative filtering  
- Store user preferences using persistent storage  
- Deploy using Docker & cloud services  
- Create a chatbot-style UI  
- Build admin dashboard for analytics  

---

## ⭐ Show your support

If you found this project helpful or interesting, consider giving it a ⭐ on GitHub!
