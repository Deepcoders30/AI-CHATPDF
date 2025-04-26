# ChatPDF - Fullstack 

## Overview
ChatPDF is a full-stack application that enables users to upload PDF documents and ask questions related to their content.
The backend processes these PDFs using natural language processing (NLP) techniques to generate accurate responses to user queries.
The frontend provides a clean, interactive interface for uploading documents and chatting with the system.

## Features
- PDF Upload: Upload and manage PDF documents easily.
- Ask Questions: Interact with uploaded PDFs by asking natural language questions.
- Real-Time Answers: User's question appears immediately; the system provides an intelligent answer once processed.
- Follow-up Questions: Continue querying the same document with multiple questions.
- Responsive UI: Intuitive and fast frontend design for a seamless experience.

## Technologies Used

### Backend
- FastAPI – Python web framework for building APIs.
- LangChain / LlamaIndex – NLP libraries for understanding and answering questions from PDFs.
- PyMuPDF – For extracting text from PDFs.
- Local File Storage – For storing uploaded PDF files.

### Frontend
- React.js – Frontend library for building user interfaces.
- Vite – Frontend build tool and development server.
- TailwindCSS – For UI styling.
- Fetch – For making API requests.
