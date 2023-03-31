# COVID-19 Question Answering Pipeline
A COVID-19 Question Answer Pipeline and REST API built with Haystack Framework, ElasticSearch and HF Transformers
The objective is to explore the various possibilities of the Haystack Framework and to build a scalable system that can be used to answer the most common questions about the COVID-19 with a discrete precision.

# The Dataset
For the Extractive and Generative System, COVID-QA dataset from deepset was used. The dataset contains in SQuAD format 147 contexts with relative questions and proposed answers
The data was extracted from several scientific paper from early March 2020. Due to their nature, the language and the content are quite technical and each text is long several pages.

For the FAQ System instead, 6 additional DBs were used for a total of roughly 9k english question-answer pairs. Many of these pairs were crawled from several institutional websites (like WHO and CDC) or other credible sources.

List of the Datasets:
https://github.com/sunlab-osu/covid-faq

# Data cleaning and Preprocessing

Question-Answer Pairs and COVID-QA documents were added to the ElasticSearch DB.

The preprocessing consisted into removing headers,footers,whitespaces and then splitting all the documents into shards of 100 tokens to improve inference time.

# The System

The system uses the Retriever-Reader paradigm

![FOoMr0SWUAMDWik](https://user-images.githubusercontent.com/100691347/229138180-0319477e-7e92-434f-b976-9c47523f2f7e.png)


It consists into three main components: 
  1.  the DB which contains the Knowledge, usually consisting in unstructured data,as in our case.
  2.  the Retriever, which usually uses a sparse representation (BoW,TF-IDF,BM25) of the data or a dense one (embeddings) to compare the question of the user with each document in the knowledge base to retrieve the most relevant.
  3. the Reader, which usually consists into a transformer as in our case, that given a question and a context extracts the answer from the context and returns it.
  
  
