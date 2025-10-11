
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
