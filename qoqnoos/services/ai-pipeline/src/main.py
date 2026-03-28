from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import openai
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from sse_starlette.sse import EventSourceResponse
from .knowledge_base import COMPANION_SYSTEM_PROMPT

app = FastAPI(title="Qoqnoos AI Pipeline", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class CompanionRequest(BaseModel):
    session_id: str
    user_id: str
    message: str
    language: str = "en"
    history: list[dict] = []
    user_profile: Optional[dict] = None
    stream: bool = True

class CompanionResponse(BaseModel):
    content: str
    framework_used: Optional[str] = None
    emotion_detected: Optional[str] = None

@app.post("/companion/chat")
async def companion_chat(request: CompanionRequest):
    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
    vectorstore = PineconeVectorStore(index_name="qoqnoos-knowledge", embedding=embeddings)
    relevant_docs = vectorstore.similarity_search(request.message, k=5)
    knowledge_context = "\n".join([f"[{doc.metadata['framework']}]: {doc.page_content}" for doc in relevant_docs])
    system_prompt = COMPANION_SYSTEM_PROMPT + f"\n\n## RELEVANT KNOWLEDGE:\n{knowledge_context}\n\nLanguage: {request.language}\n"
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(request.history)
    messages.append({"role": "user", "content": request.message})
    if request.stream:
        async def generate():
            client = openai.AsyncOpenAI()
            stream = await client.chat.completions.create(model="gpt-4o", messages=messages, max_tokens=1000, temperature=0.7, stream=True)
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield {"data": chunk.choices[0].delta.content}
        return EventSourceResponse(generate())
    else:
        client = openai.AsyncOpenAI()
        response = await client.chat.completions.create(model="gpt-4o", messages=messages, max_tokens=1000)
        return CompanionResponse(content=response.choices[0].message.content)

@app.post("/journal/analyze")
async def analyze_journal(entry: str, user_id: str, language: str = "en"):
    prompt = f"Analyze this journal entry with compassion. Language: {language}\n\nEntry: {entry}\n\nProvide: 1) Emotional themes 2) Frameworks 3) Reflection 4) Inquiry question 5) Persian poetry quote. JSON format."
    client = openai.AsyncOpenAI()
    response = await client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}], response_format={"type": "json_object"})
    return response.choices[0].message.content

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "qoqnoos-ai-pipeline"}
