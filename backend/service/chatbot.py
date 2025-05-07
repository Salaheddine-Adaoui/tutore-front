

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.llms import Ollama
from pathlib import Path

# Définition du chemin vers le fichier PDF
BASE_DIR = Path(__file__).resolve().parent.parent
PDF_FILE = BASE_DIR / "static" / "dataPdf" / "infos_ensa.pdf"

loader=PyPDFLoader(PDF_FILE)
pages=loader.load()

text_spliter=RecursiveCharacterTextSplitter(chunk_size=500,chunk_overlap=50)
documents=text_spliter.split_documents(pages)

embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

faiss_db=FAISS.from_documents(documents,embedding_model)

model=Ollama(model='llama3')
 
def genrer_reponse(question):
    docs=faiss_db.similarity_search(question,k=3)
    contexte = "\n".join([doc.page_content for doc in docs])  
    contexte_formaté = f"""
        Tu es un chatbot personnalisé pour l'École Nationale des Sciences Appliquées de Khouribga (ENSA Khouribga).
        Tu réponds aux questions des étudiants en français et tu t'appuies sur les informations suivantes :

        {contexte}

        Si l'information demandée n'est pas disponible, dis simplement que tu ne sais pas.
        """
    response= model.invoke(f"{contexte_formaté}\n\nQuestion: {question}")
    return response

