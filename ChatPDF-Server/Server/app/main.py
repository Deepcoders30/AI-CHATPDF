from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
import uuid
import fitz

# Initialize app
app = FastAPI()

# Loading Environment variables
load_dotenv()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
docs_record = {}
chat_history_db = {}


def extracting_from_pdf(pdf_bytes):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    texts = [page.get_text() for page in doc]
    return "\n".join(texts)

def create_vectorstore(text):
    splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.create_documents([text])
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = FAISS.from_documents(chunks, embedding_model)
    return vector_store

def initializing_LLM_Groq():
    return ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0,
        max_tokens=None,
        timeout=None,
    )

# API Endpoints
@app.post("/upload")
async def upload(pdfFile: UploadFile = File(...)):
    pdf_in_bytes = await pdfFile.read()
    all_text = extracting_from_pdf(pdf_in_bytes)
    vector_store = create_vectorstore(all_text)
    
    doc_id = str(uuid.uuid4())
    docs_record[doc_id] = vector_store

    return {
        "document_id": doc_id,
        "filename": pdfFile.filename,
        "message": "PDF Uploaded Successfully"
    }

@app.post("/ask")
async def askQuestion(request: Request):
    data = await request.json()
    doc_id = data["doc_id"]
    question_input = data["question"]

    llm = initializing_LLM_Groq()
    retriever = docs_record[doc_id].as_retriever()

    condense_question_system_template = (
        "Given a chat history and the latest user question "
        "which might reference context in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, "
        "just reformulate it if needed and otherwise return it as is."
    )
    
    condense_question_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", condense_question_system_template),
            ("placeholder", "{chat_history}"),
            ("human", "{input}"),
        ]
    )

    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, condense_question_prompt
    )

    system_prompt = (
        "You are an expert PDF document assistant specialized in analyzing and answering questions about uploaded documents. "
        "Always follow these rules:\n"
        "1. Use ONLY the provided document context to answer - never invent information\n"
        "2. If the answer isn't in the document, respond: 'This information is not in the provided document'\n"
        "3. Keep answers concise (2-3 sentences maximum) but informative\n"
        "4. When relevant, include page numbers or section references from the document\n"
        "5. For document-wide questions (like summaries), provide comprehensive but brief overviews\n\n"
        "{context}"
    )

    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("placeholder", "{chat_history}"),
            ("human", "{input}"),
        ]
    )

    QA_chain = create_stuff_documents_chain(llm, qa_prompt)
    conversation_QA_chain = create_retrieval_chain(history_aware_retriever, QA_chain)

    history = chat_history_db.get(doc_id, [])
    langchain_history = []
    for human, ai in history:
        langchain_history.append(("human", human))
        langchain_history.append(("ai", ai))

    result = conversation_QA_chain.invoke({
        "input": question_input,
        "chat_history": langchain_history,
    })

    history.append((question_input, result["answer"]))
    chat_history_db[doc_id] = history

    return {"answer": result["answer"]}
