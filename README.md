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



## Backend Details

The backend is built using **Node.js** and **Express**, handling API requests, LLM integration, and database storage.

### server.js
- Entry point of the backend application.
- Sets up the Express server, middleware, and routes.
- Routes included:
  - `/api/status` → simple health check endpoint.
  - `/api/symptom-check` → accepts symptom text from the user and returns AI analysis.
  - `/api/history` → fetches all chat history.
- Uses `cors` and `express.json()` for handling requests.
- Environment variables are loaded via `.env`.

### db.js
- Handles **MySQL database connection** using `mysql2`.
- Configures a connection pool for efficient queries.
- Connects to the `healthcare_db` database.
- Exports a promise-based interface for async database queries.

### routes/chat.js
- Contains **API routes** for chat operations:
  1. `GET /history` → fetch all previous chats from the database.
  2. `DELETE /history/:id` → delete a chat entry by ID.
  3. `POST /symptom-check` → send user symptoms to the LLM and save AI output to the database.

- Handles errors gracefully and responds with appropriate HTTP status codes.

### gemini/geminiClient.js
- Integrates with **Google Gemini API** (LLM) for AI symptom analysis.
- Exports `getSymptomAnalysis(symptoms)` function:
  - Sends a **carefully crafted prompt** to the LLM including instructions to:
    - Suggest 3–5 probable health conditions.
    - Provide recommended next steps (self-care, monitoring, urgent care advice).
    - Include a mandatory educational disclaimer.
  - Returns structured text output from the LLM.
- Uses `GoogleGenerativeAI` SDK and `gemini-2.5-flash-lite` model.

### Key Functions:
- `getSymptomAnalysis(symptoms)` → Sends symptom text to LLM and receives structured output.
- Database queries in `chat.js`:
  - `INSERT INTO chat_history (user_query, ai_response)` → stores new queries.
  - `SELECT * FROM chat_history ORDER BY id DESC` → fetches chat history.
  - `DELETE FROM chat_history WHERE id = ?` → deletes a chat entry.

---

## Frontend Details

### App.jsx

This is the main React component that handles the **chat interface**, **user input**, **AI responses**, and the **chat history sidebar**.  

**Key Features:**

1. **Chat Interface:**
   - Displays user and AI messages in a conversational format.
   - AI messages are structured into:
     - **Probable Conditions**
     - **Recommended Next Steps**
   - Styled using Tailwind CSS for clarity and readability.
   - Chat messages dynamically scroll to the latest message using `useRef`.

2. **Input Box for Symptoms:**
   - Multi-line textarea for users to type their symptoms.
   - Submits input to the backend API `/api/symptom-check`.
   - Disabled while AI response is loading to prevent multiple submissions.

3. **Sidebar for Chat History:**
   - Opens from the right using a toggle button.
   - Fetches **chat history** from the backend `/api/history`.
   - Displays a **truncated preview** (first 70 characters) of AI responses.
   - Clicking a history entry opens the **full AI response** in the chat window.
   - Each entry has a **delete button** to remove it from the database.

4. **Loading & Error Handling:**
   - Shows `Analyzing...` while backend is processing the request.
   - Alerts the user if the request fails or there’s a server error.

### utils.js

Contains helper function `parseAIResponse(response)`:

- Splits AI response into **conditions** and **recommended steps**.
- Converts the raw text from LLM into structured JSON format.
- Used by App.jsx to render AI messages clearly in the frontend.


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

## 🎥 Demo Video



Watch the full walkthrough of the **Healthcare Symptom Checker** in action below:

👉 [Click here to view the demo video](./Healthcare%20Sympton%20Checker%20Demo%20Video.mp4)

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






