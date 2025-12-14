# 📊 AI-Powered Analytics Dashboard

A full-stack analytics dashboard with **role-based access**, **real-time AI assistant**, and **context-aware UI actions**.  
The AI can **filter reviews, trigger charts, and respond contextually** based on the active page.

---

## 🚀 Features

### 🔐 Authentication & Roles

- JWT-based authentication
- Roles: **Admin** & **Analyst**
- Protected routes

### 📈 Analytics Dashboard

- Global metrics (Users, Products, Reviews, Assignments)
- Sentiment breakdown
- Review volume trends
- Dynamic charts (Pie / Bar / Line)

### 🤖 AI Assistant

- Context-aware AI assistant embedded in UI
- Real-time streaming responses
- Triggers UI actions (filters, charts, navigation)
- Socket.IO powered live streaming
- Groq LLM (LLaMA 3.3)

### 💬 Chat UX

- WhatsApp / iChat-style chat bubbles
- User messages on the right
- Assistant replies on the left
- Bottom-sheet chat drawer

---

## 🧱 Tech Stack

**Frontend**

- React 18
- TypeScript
- Vite
- Tailwind CSS + DaisyUI
- Socket.IO Client

**Backend**

- Node.js + Express
- Prisma ORM
- MongoDB
- Socket.IO

**AI / ML**

- FastAPI (Python)
- Groq API (LLaMA-3.3-70B)

---

## ⚙️ Setup Instructions

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### AI Service

```bash
cd analytics
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## 🔌 Environment Variables

**Backend**

```env
DATABASE_URL=
JWT_SECRET=
```

**AI Service**

```env
GROQ_API_KEY=your_groq_api_key
```

---

## 🧠 AI UI Action Protocol

```json
{
  "reply": "Showing positive reviews.",
  "ui_action": {
    "type": "filter_sentiment",
    "sentiment": "positive"
  }
}
```

Supported actions:

- filter_sentiment
- reset_reviews
- set_chart
- navigate
