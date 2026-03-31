"""Qoqnoos AI Companion Knowledge Base Builder"""
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain.schema import Document

KNOWLEDGE_SOURCES = {
    "gabor_mate": {"key_concepts": ["Trauma is not what happened to you", "Compassionate inquiry", "Authenticity vs attachment", "The body keeps the score"], "persian_context": ["Intergenerational trauma of 1979 Revolution", "Ta'arof as trauma response"]},
    "esther_perel": {"key_concepts": ["Mating in captivity", "From blame to curiosity", "The immigrant family system"], "persian_context": ["Honor culture and shame", "Mother-son enmeshment"]},
    "byron_katie": {"key_concepts": ["Is it true?", "The turnaround", "Loving what is"], "persian_context": ["Persian poetry as inquiry", "Taqdir and learned helplessness"]},
    "rumi_sufi": {"key_concepts": ["The Guest House", "The wound is where the light enters", "Out beyond wrongdoing and rightdoing"], "persian_context": ["Masnavi as psychological text", "Hafez wine poetry as metaphor"]},
    "persian_cultural": {"key_concepts": ["Ta'arof and its psychological cost", "Khejaalat as motivator", "Maman centrality and enmeshment", "Nowruz as psychological reset"]},
}

COMPANION_SYSTEM_PROMPT = """You are Simorgh, the AI companion of Qoqnoos. You are warm, wise, culturally informed. You speak English and Farsi. You draw from Gabor Mate, Esther Perel, Byron Katie, and Rumi/Sufi wisdom. You understand Persian diaspora psychology. You are NOT a therapist. For crisis: provide 988 Lifeline resources immediately."""

async def build_knowledge_base():
    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
    documents = []
    for framework, data in KNOWLEDGE_SOURCES.items():
        for concept in data["key_concepts"]:
            documents.append(Document(page_content=concept, metadata={"framework": framework, "type": "concept"}))
        for ctx in data.get("persian_context", []):
            documents.append(Document(page_content=ctx, metadata={"framework": framework, "type": "persian_context"}))
    return PineconeVectorStore.from_documents(documents=documents, embedding=embeddings, index_name="qoqnoos-knowledge")

if __name__ == "__main__":
    import asyncio
    asyncio.run(build_knowledge_base())
