# WhatsApp AI Message Notification Router

An intelligent, multimodal AI notification routing system that automatically classifies incoming WhatsApp messages into **Notify**, **Digest**, or **Mute** actions based on content, OCR text, voice note transcripts, user relationships, business trust scores, historical engagement, and real-time scam/spam detection.

---

## 🌟 Key Features

- **Multimodal Message Classification**: Understands text, image posters/screenshots (OCR), and audio voice notes.
- **Scam & Spam Defense Engine**: Detects lottery claims, unfreeze account scams, phishing shortlinks, and suspicious payment requests.
- **Business Trust Engine**: Evaluates verified businesses, active delivery tracking, payment due reminders, and subscription statuses.
- **Personalization & Historical Reasoning**: Cross-references past user responses (e.g., replied vs. repeatedly ignored messages).
- **Interactive React Dashboard**: Real-time status logs, dataset upload, single-message tester, analytics charts, and `output.csv` viewer.
- **Gemini 3.6 Flash Reasoning**: Deep semantic reasoning for nuanced message prioritization.

---

## 📁 Project Structure

```text
├── backend/
│   ├── app.py                      # FastAPI App entry point
│   ├── routes/                     # Predict & Analytics routes
│   │   ├── predict_routes.py
│   │   └── analytics_routes.py
│   ├── services/                   # Modular reasoning engines
│   │   ├── data_loader.py
│   │   ├── ocr_service.py
│   │   ├── voice_service.py
│   │   ├── retrieval_engine.py
│   │   ├── business_trust_engine.py
│   │   ├── spam_scam_detector.py
│   │   ├── personalization_engine.py
│   │   ├── notification_decision_engine.py
│   │   ├── confidence_calculator.py
│   │   ├── output_generator.py
│   │   └── gemini_reasoning.py
│   ├── models/                     # Pydantic schemas
│   ├── utils/                      # Logger & helpers
│   ├── prompts/                    # Gemini routing prompts
│   └── output/                     # Generated output.csv target
├── dataset/                        # Input CSV datasets & media
│   ├── messages.csv
│   ├── users.csv
│   ├── groups.csv
│   ├── group_members.csv
│   ├── business_accounts.csv
│   ├── user_business_history.csv
│   ├── message_history.csv
│   ├── message_events.csv
│   ├── images.csv
│   ├── voice_notes.csv
│   └── daily_notification_summary.csv
├── src/                            # React + Tailwind Dashboard
│   ├── App.tsx
│   ├── components/
│   └── types.ts
├── output.csv                      # Required prediction output
├── server.ts                       # Express + Vite Full-Stack Bridge
└── README.md
```

---

## 🚀 Setup & Execution Instructions

### 1. Requirements

Ensure Python 3.11+ and Node.js 18+ are installed.

```bash
pip install -r backend/requirements.txt
npm install
```

### 2. Running FastAPI Backend (Standalone)

```bash
uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Running Web Application (Full-Stack Express + React Dashboard)

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 📊 Output Dataset Format (`output.csv`)

| Column Header | Description | Example Value |
|---|---|---|
| `message_id` | Unique ID of incoming message | `M1001` |
| `action` | Routing action (`notify`, `digest`, `mute`) | `notify` |
| `message_type` | Medium type (`text`, `image`, `voice`) | `text` |
| `reason` | Explanation for decision | `High priority: Emergency family update` |
| `confidence` | Floating point score (0.00 - 1.00) | `0.98` |
| `evidence_message_ids` | Historical or related message reference | `H001` |

---

## 🔑 Environment Variables

Set `GEMINI_API_KEY` in your environment or `.env` file to enable Gemini AI reasoning.
