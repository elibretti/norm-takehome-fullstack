from pydantic import BaseModel
import qdrant_client
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
from llama_index.core.schema import Document
from llama_index.core import (
    Settings,
    VectorStoreIndex,
    ServiceContext,
)
from dataclasses import dataclass
import os
import fitz

key = os.environ['OPENAI_API_KEY']

@dataclass
class Input:
    query: str
    file_path: str

@dataclass
class Citation:
    source: str
    text: str

class Output(BaseModel):
    query: str
    response: str
    citations: list[Citation]

class DocumentService:

    """
    Update this service to load the pdf and extract its contents.
    The example code below will help with the data structured required
    when using the QdrantService.load() method below. Note: for this
    exercise, ignore the subtle difference between llama-index's 
    Document and Node classes (i.e, treat them as interchangeable).

    # example code
    def create_documents() -> list[Document]:

        docs = [
            Document(
                metadata={"Section": "Law 1"},
                text="Theft is punishable by hanging",
            ),
            Document(
                metadata={"Section": "Law 2"},
                text="Tax evasion is punishable by banishment.",
            ),
        ]

        return docs

     """
    def create_documents(self) -> list[Document]:
        doc = fitz.open("docs/laws.pdf")
        docs = []
        current_section = None
        current_text = ""
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            
            # Extract text with formatting information
            text_dict = page.get_text("dict")
            
            for block in text_dict["blocks"]:
                if "lines" not in block:
                    continue
                    
                for line in block["lines"]:
                    line_text = ""
                    is_bold = False
                    
                    # Check each span in the line for text and formatting
                    for span in line["spans"]:
                        span_text = span["text"]
                        line_text += span_text
                        
                        # Check if this span is bold by looking at the font name
                        if "bold" in span["font"].lower():
                            is_bold = True
                    
                    line_text = line_text.strip()
                    if not line_text:
                        continue
                    
                    # If line is bold it's a header so skip it and start new section
                    if is_bold:
                        print(f"Skipping bold header: {line_text}")
                        if current_section and current_text.strip():
                            self._save_document(docs, current_section, current_text)
                        current_section = None
                        current_text = ""
                        continue
                    
                    # Check if this is a law section (1.1, 1.2.1),  if it is we save the previous section and start a new one
                    if line_text and line_text[0].isdigit() and len(line_text.split('.')) > 2:
                        if current_section and current_text.strip():
                            self._save_document(docs, current_section, current_text)

                        current_section = line_text
                        current_text = ""
                        
                    # Check if this is a top-level section title, if it is we save the previous section and skip this one 
                    elif current_section and line_text and line_text[0].isdigit() and len(line_text.split('.')) == 2:
                        self._save_document(docs, current_section, current_text)
                        current_section = None
                        current_text = ""
                        
                    # Check if we've reached the end of the document (Citations section)
                    elif line_text.startswith("Citations"):
                        if current_section and current_text.strip():
                            self._save_document(docs, current_section, current_text)
                        current_section = None
                        current_text = ""
                        
                    # Add content to current section
                    else:
                        if current_section:
                            current_text += line_text + " "
        
        # Save the last section
        if current_section and current_text.strip():
            self._save_document(docs, current_section, current_text)
        
        doc.close()
        return docs
    
    def _save_document(self, docs: list, section: str, text: str) -> None:
        print(f"Creating document for section {section}: {text[:50]}...")
        docs.append(Document(
            metadata={"Section": section},
            text=text.strip()
        ))

class QdrantService:
    def __init__(self, k: int = 2):
        self.index = None
        self.k = k
    
    def connect(self) -> None:
        client = qdrant_client.QdrantClient(location=":memory:")
                
        vstore = QdrantVectorStore(client=client, collection_name='temp')

        Settings.embed_model = OpenAIEmbedding()
        Settings.llm = OpenAI(api_key=key, model="gpt-4")

        self.index = VectorStoreIndex.from_vector_store(
            vector_store=vstore
            )

    def load(self, docs = list[Document]):
        self.index.insert_nodes(docs)
    
    def query(self, query_str: str) -> Output:
        # Create a query engine that returns sources and metadata
        query_engine = self.index.as_query_engine(
            similarity_top_k=self.k,
            response_mode="compact" 
        )
        response = query_engine.query(query_str)

        # Extract citations from the response
        citations = []
        if hasattr(response, 'source_nodes') and response.source_nodes:
            for node in response.source_nodes:
                if hasattr(node, 'metadata') and node.metadata:
                    citations.append(Citation(
                        source=node.metadata.get("Section", "Unknown"),
                        text=node.text
                    ))
        
        # Create the output object
        output = Output(
            query=query_str,
            response=str(response),
            citations=citations
        )
        print(output)
        return output
        """
        This method needs to initialize the query engine, run the query, and return
        the result as a pydantic Output class. This is what will be returned as
        JSON via the FastAPI endpount. Fee free to do this however you'd like, but
        a its worth noting that the llama-index package has a CitationQueryEngine...

        Also, be sure to make use of self.k (the number of vectors to return based
        on semantic similarity).

        # Example output object
        citations = [
            Citation(source="Law 1", text="Theft is punishable by hanging"),
            Citation(source="Law 2", text="Tax evasion is punishable by banishment."),
        ]

        output = Output(
            query=query_str, 
            response=response_text, 
            citations=citations
            )
        
        return output

        """
                
       

if __name__ == "__main__":
    # Example workflow
    doc_serivce = DocumentService() # implemented
    docs = doc_serivce.create_documents() # NOT implemented

    index = QdrantService( k=3) # implemented
    index.connect() # implemented
    index.load(docs) # implemented

    index.query("what happens if I steal?") # NOT implemented





