# Healthcare Symptom Checker

A web application that allows users to input their symptoms and receive probable health conditions along with recommended next steps. 

---

## 🔹 Objective
- Input symptoms in natural language.
- Output probable health conditions and recommended next steps.
- Store queries and AI responses in a database for history.
- Provide an interactive frontend with chat interface and sidebar for past queries.

---

## 🔹 Features
- Real-time symptom analysis using **Google Gemini AI (LLM)**.
- Probable conditions and safe educational recommendations.
- Chat history sidebar with delete functionality.
- Full frontend-backend separation.
- MySQL database integration to store queries and AI responses.

---

## 🔹 Tools & Technologies Used
| Layer          | Tools / Libraries                                 |
|----------------|--------------------------------------------------|
| Frontend       | React, Tailwind CSS, Lucide-React (icons)       |
| Backend        | Node.js, Express.js                              |
| Database       | MySQL                                            |
| LLM / AI       | Google Gemini AI (gemini-2.5-flash-lite model)  |
| Others         | dotenv, cors, mysql2                              |

---



## 🔹 Backend Details

### **server.js**
- Starts the server on specified port.
- Configures middleware: `cors`, `express.json()`.
- Defines a test route: `/api/status`.
- Uses `chat.js` for all API endpoints under `/api`.

### **db.js**
- Connects to MySQL database using `mysql2`.
- Uses connection pool and promise-based queries.
- Logs success or failure of database connection.

### **geminiClient.js**
- Calls **Google Gemini AI** with a structured prompt:
  - Suggests 3–5 probable conditions based on symptoms.
  - Provides 5–6 educational recommended steps.
  - Includes a disclaimer: “For educational purposes only.”
- Returns AI-generated text.

### **routes/chat.js**
- **GET /api/history** – Fetch all past queries and responses.
- **POST /api/symptom-check** – Analyze symptoms, save result in DB.
- **DELETE /api/history/:id** – Delete a specific history entry by ID.

---

## 🔹 Frontend Details

### **App.jsx**
- Chat interface with:
  - Input box for symptoms.
  - Dynamic chat messages (user & AI).
- Sidebar for viewing **history of queries**:
  - Shows truncated AI response by default.
  - Delete button to remove entries.
  - Click to expand full AI response.
- Fetches backend APIs to save and retrieve chat history (replace dummy data in dev).

### **utils.js**
- `parseAIResponse(response)`:
  - Splits AI response into **conditions** and **recommended steps**.
  - Converts text to structured JSON for rendering in frontend.

---

### **Output Screenshots**
1) Symptoms queries by user and LLM generating probable conditions:
<img width="959" height="533" alt="A" src="https://github.com/user-attachments/assets/8d0b67ae-ef8e-4871-b05b-a35cddfa81ab" />

2) LLM generating recommended steps along with disclaimer:
<img width="959" height="505" alt="B" src="https://github.com/user-attachments/assets/982b45a9-7542-4d0d-aa70-d9dd95df8177" />

3) Chat history showing users querisand the LLM generated responses.
<img width="959" height="503" alt="C" src="https://github.com/user-attachments/assets/5c009207-c061-4739-b83b-d840ace19b14" />

4) On clicking delete icon, the queries and responses are deleted.
<img width="958" height="505" alt="D" src="https://github.com/user-attachments/assets/9d9946fe-1261-4f8b-b6c6-fb7c001da0b1" />

5) On clicking the history, it opens the generated responses.
<img width="959" height="503" alt="image" src="https://github.com/user-attachments/assets/02b11354-d913-4500-95fc-f082b32c2470" />

---

## 🔹 Database Schema

```sql
CREATE DATABASE IF NOT EXISTS healthcare_db;
USE healthcare_db;

CREATE TABLE IF NOT EXISTS chat_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_query TEXT NOT NULL,
  ai_response LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);






