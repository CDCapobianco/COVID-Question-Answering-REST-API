from haystack.document_stores import ElasticsearchDocumentStore
from haystack.nodes import PreProcessor
from datasets import load_dataset
from haystack.nodes import EmbeddingRetriever
import pandas as pd

embedding_model = "sentence-transformers/multi-qa-mpnet-base-dot-v1"
document_store = ElasticsearchDocumentStore(return_embedding=True)
document_store.delete_documents()
document_store.delete_labels()

er = EmbeddingRetriever(document_store=document_store,embedding_model=embedding_model)

df_pref = ["data/faq"]

for i in range(1,6): 
    df_path = df_pref+i+'.csv'
    df = pd.read_csv(df_path,converters={'embedding': pd.eval})
    df.fillna("",inplace=True)
    docs_to_index = df.to_dict(orient="records")
    document_store.write_documents(docs_to_index)

print(f"{document_store.get_document_count()} documents were written!")