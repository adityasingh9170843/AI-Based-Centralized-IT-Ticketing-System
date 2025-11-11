for screenshots.
# 📡 AI-Powered IT Ticket Management System

A modern IT helpdesk platform that uses **AI + vector embeddings** to automatically classify, route, and assign tickets — eliminating manual workload and ensuring faster resolution.

---

## 🧠 Project Overview

This system transforms traditional IT support by integrating **AI-driven automation** at every step of the ticket lifecycle.

Instead of manually reading each ticket, interpreting the issue, guessing the right department, or assigning an engineer —
the system uses **Gemini AI**, **Google Embeddings**, **LangChain**, and **Pinecone** to understand the problem and autonomously take action.

### ✅ What the system does automatically:

* Understands the problem written by the user
* Predicts the correct department
* Determines ticket priority
* Finds the best engineer using similarity search
* Assigns the ticket instantly
* Suggests similar historical issues to speed up resolution

No manual triaging. No guesswork. No delays.
Just **AI-powered smart routing**.

---

## 🤖 How the AI Works

### 1️⃣ Semantic Understanding with Embeddings

Every ticket description and every engineer’s expertise is converted into a **high-dimensional vector** using:

* **Google Generative AI Embeddings**
* Stored inside **Pinecone vector database**

These embeddings capture meaning —
so the system understands:

✅ “VPN not connecting” is similar to
✅ “Unable to access office network”

even though the words are different.

---

### 2️⃣ Engineer Matching with Similarity Search

When a new ticket arrives:

✅ The description is converted into a vector
✅ Pinecone performs a **similarity search**
✅ Finds the engineers whose expertise vectors match the issue
✅ Assigns the right engineer automatically

This replaces human decision-making with pure semantic intelligence.

---

### 3️⃣ Similar Ticket Lookup

For every new issue, the system also retrieves:

* Past tickets
* Related problems
* Resolutions

This gives instant context to the engineer and reduces duplicate efforts.

---

## 🚀 Why This Matters

Traditional IT helpdesk systems rely on:

* Manual reading
* Manual department routing
* Manual priority estimation
* Manual engineer assignment

This causes:

❌ Delays
❌ Misrouted tickets
❌ Overloaded engineers
❌ Slow resolution

With embeddings + vector search:

✅ Tickets are routed instantly
✅ Engineers get relevant tickets
✅ Admin workload drops to near zero
✅ System gets smarter as more data grows

Your helpdesk becomes a **self-organizing AI system**.

---

## 🧬 Tech Stack

### Backend

* Node.js / Express
* MongoDB
* Gemini 2.5 Flash
* Google Embeddings
* LangChain
* Pinecone Vector DB
* IMAP Email Integration
* JWT Authentication

### Frontend

* React + Vite
* Tailwind CSS
* ShadCN UI
* Axios
* React Router

---

## 🖼️ Screenshots (to be added)

```
[ Dashboard Screenshot ]
[ Tickets List ]
[ Engineer Management ]
[ Ticket Details Page ]
```

*(Place your screenshots here in future updates)*

---

## 📥 Email to Ticket Automation

Incoming emails from the support inbox are read using IMAP and automatically transformed into structured tickets.
The AI then performs the same analysis and assignment as web-submitted tickets.

This means the entire support flow can run without human involvement.

---

## 🔐 Access Control

Role-based authentication via JWT:

* **Admin** – manages engineers, departments, all tickets
* **Engineer** – views assigned tickets, resolves and closes them

---

## 🌱 Project Status

✅ AI ticket classification
✅ Vector-based engineer assignment
✅ Similar ticket recommendations
✅ Admin & engineer dashboards
✅ Email → Ticket automation
⬜ Chatbot (coming soon)
⬜ Analytics dashboard (coming soon)

This project is actively evolving — more automation and intelligence coming soon.

