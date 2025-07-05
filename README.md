# 📄 ChatPDF 

##  📖 Overview
ChatPDF is a full-stack application that enables users to upload PDF documents and ask questions related to their content.
The backend processes these PDFs using natural language processing (NLP) techniques to generate accurate responses to user queries.
The frontend provides a clean, interactive interface for uploading documents and chatting with the system.

## ✨ Features
- PDF Upload: Upload and manage PDF documents easily.
- Ask Questions: Interact with uploaded PDFs by asking natural language questions.
- Real-Time Answers: The User's question appears immediately; the system provides an intelligent answer once processed.
- Follow-up Questions: Continue querying the same document with multiple questions.
- Responsive UI: Intuitive and fast frontend design for a seamless experience.

## 🛠️ Technologies Used

### Backend
- FastAPI – Python web framework for building APIs.
- LangChain – NLP libraries for understanding and answering questions from PDFs.
- PyMuPDF – For extracting text from PDFs.
- Local File Storage – This is for storing uploaded PDF files.

### Frontend
- React.js – Frontend library for building user interfaces.
- Vite – Frontend build tool and development server.
- TailwindCSS – For UI styling.
- Fetch – For making API requests.

## 🚀 Setup & Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (for the frontend)
- **Python 3.9+** (for the backend)
- pip (Python package installer)

### Clone the Repository

Start by cloning the repository to your local machine:

 ```bash
  git clone https://github.com/Deepcoders30/AI-CHATPDF.git
  cd AI-CHATPDF
```

### Frontend Setup (React + Vite)

1. Navigate to the frontend directory:

   ```bash
   cd ChatPDF-Client
   cd ChatPDF

2. Install the required Node.js dependencies:

   ```bash
   npm install

3. Start Development Server:

   ```bash
   npm run dev

### Backend Setup (FastAPI)

1. Navigate to the backend directory:

   ```bash
   cd ChatPDF-Server

2. Install dependencies:

   ```bash
    pip install -r requirements.txt

3. Setup Environment Variables:
    ```env
    Create a `.env` file in the `ChatPDF-Server` directory with your required credentials
    
    Add your environment variables:
    GROQ_API_KEY=your-groq-api-key
  

4. Run FastAPI Server:

   ```bash
   cd Server/app
   fastapi dev main.py


## 🏗️ Architecture

### System Overview

The AI-ChatPDF application follows a client-server architecture with the following components:

1. **Frontend (React.js)**
   - User interface for document upload
   - Chat interface for asking questions
   - Response visualization
     
2. **Backend (FastAPI)**
   - API endpoints for document management and question answering
   - PDF processing pipeline
   - Integration with NLP services

3. **Document Processing**
   - PDF text extraction
   - Document indexing using LangChain/LlamaIndex
   - Vector database for semantic search.

## 📚 API Endpoints Documentation

### 1. Upload PDF Document

- **Endpoint:** `/upload`
- **Method:** `POST`

#### Request Body:

```json
{
  "file": pdf_file
}
```

#### Response

```json
 {
  "document_id": "uuid-string",
  "filename": "document.pdf",
  "message": "upload successfully"
}
```
### 2. Ask question

- **Endpoint:** `/ask`
- **Method:** `POST`

#### Request Body:

```json
{
  "doc_id": "uuid-string",
  "question": "Your question here"
}
```

#### Response

```json
{
  "answer": "The AI-generated answer based on the PDF content."
}
```

