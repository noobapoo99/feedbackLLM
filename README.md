# Full Project README – Product Review Analytics Platform

## 📌 Overview  
This platform allows **admins** to upload product review CSVs, perform **sentiment analysis**, assign reviews to analysts, and visualize global analytics.  
**Analysts** can view assigned reviews, ask questions through an integrated AI chat, and explore data insights.

---

# 🚀 Features

## 🔐 Authentication System
- Login & Register functionality (JWT-based)
- Role-based access: **ADMIN** and **ANALYST**
- Protected routes using middleware

---

# 🛠 Backend (Node.js + Express + Prisma + MongoDB)

## 📦 Major Modules
### **1. Authentication**
- Login, Register, `/auth/me`
- Token-based authentication
- Role verification middleware

### **2. Product Management**
- Add/get products
- Count reviews for each product

### **3. CSV Upload System**
- Admin uploads review CSV files
- Uploaded data processed row-by-row
- Sentiment analysis via Python FastAPI
- Deduplication logic to avoid repeat insertion
- Safe parsing for ratings, reviewer names, and missing fields

### **4. Review Assignment**
- Admin manually assigns products to analysts
- Each analyst sees only their assigned reviews

### **5. Global Analytics API**
- Sentiment breakdown
- Category performance
- Review volume over time
- Top/bottom products analytics

---

# 🤖 Python Analytics Service (FastAPI + Transformers)

## ✔ Responsibilities
- Sentiment analysis using **DistilBERT**
- `/analyze` endpoint receives review text and returns:
  ```json
  {
    "sentiment": "positive",
    "score": 0.99
  }
  ```
- Long text handling with truncation to 512 tokens

---

# 🎨 Frontend (React + Vite + TypeScript + Tailwind + DaisyUI)

## Main UI Sections

### **Admin Panel**
- Dashboard (Users, Reviews, Sentiment Stats)
- Manage Products
- Assign Products
- Global Analytics (Charts using Recharts)
- Upload Reviews CSV (Admin only)

### **Analyst Panel**
- View Assigned Products
- My Reviews page (Paginated, Filterable)
- AI-powered Chat window (ChatGPT-like layout)
- Chat history saved (future implementation)

---

# 📊 Global Analytics Visualizations
Uses **Recharts** to display:
- Pie chart of sentiment distribution
- Line graph of review volume (past 30 days)
- Bar chart for category performance
- Top/Bottom product ranking lists

---

# 📁 Folder Structure

```
project/
│── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   └── index.js
│
│── analytics/
│   ├── app/
│   │   └── main.py
│   └── venv/
│
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   └── utils/
│   └── vite.config.ts
```

---

# 🧪 API Endpoints Summary

## Authentication
| Method | Endpoint      | Description |
|--------|---------------|-------------|
| POST   | /auth/login   | Login user |
| POST   | /auth/register | Register user |
| GET    | /auth/me      | Get logged-in user |

## Products
| Method | Endpoint          | Description |
|--------|-------------------|-------------|
| GET    | /products         | Get all products |
| POST   | /products         | Create new product (admin) |

## Reviews
| Method | Endpoint          | Description |
|--------|-------------------|-------------|
| GET    | /reviews/my-reviews | Get reviews assigned to analyst |

## CSV Upload
| Method | Endpoint                | Description |
|--------|--------------------------|-------------|
| POST   | /admin/csv/upload        | Upload CSV + process reviews |

## Assign Products
| Method | Endpoint       | Description |
|--------|----------------|-------------|
| POST   | /assign        | Assign product to user |
| GET    | /assign        | Get all assignments |

## Global Analytics
| Method | Endpoint           | Description |
|--------|--------------------|-------------|
| GET    | /analytics/global  | Platform-level analytics |

---

# 🪄 CSV Upload Flow

1. Admin selects product  
2. Uploads CSV  
3. Backend parses each row  
4. Python service generates sentiment  
5. Review stored in DB  
6. Auto-counters update in analytics

Supported columns:
- Reviewer Name
- Review Text ✔
- Rating ✔
- Review Date (optional)

---

# 🤝 Analyst Workflow

1. Analyst logs in
2. Sees assigned products
3. Reviews listed under **My Reviews**
4. Can chat with AI for:
   - NPS analysis
   - Summary generation
   - Reasons behind ratings
   - Graph-based insights (future-expandable)

---

# ⭐ Future Enhancements
- Auto-distribute reviews across analysts
- Chat history storage in DB
- Multi-language sentiment analysis
- Keyword extraction (RAKE/KeyBERT)
- Export analytics PDF reports

---

# 🧰 Running the Project

## 1️⃣ Backend
```
cd backend
npm install
npx prisma db push
npm run dev
```

## 2️⃣ Python Analytics Server
```
cd analytics
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

## 3️⃣ Frontend
```
cd frontend
npm install
npm run dev
```

---

# 🙌 Credits  
Developed as a **Product Review Analysis Platform** integrating:  
✔ Node.js  
✔ Python NLP  
✔ MongoDB  
✔ React UI  
✔ AI-driven analytics

