# COVID-19 Question Answering Pipeline
A COVID-19 Question Answer Pipeline and REST API built with Haystack Framework, ElasticSearch and HF Transformers
The objective is to explore the various possibilities of the Haystack Framework and to build a scalable system that can be used to answer the most common questions about the COVID-19 with a discrete precision.

# The Dataset
For the Extractive and Generative System, COVID-QA dataset from deepset was used. The dataset contains in SQuAD format 147 papers with a total of 2019 questions and relative answers.
The data was extracted from several scientific paper dating back to the first pandemic wave (Spring 2020). Due to their nature, the language and the content they are quite technical and each text is long several pages.

For the FAQ System instead, 6 additional DBs were used for a total of roughly 9k english question-answer pairs. Many of these pairs were crawled from several institutional websites (like WHO and CDC) or other credible sources.

The datasets can be found here:
- https://github.com/sunlab-osu/covid-faq
- https://www.kaggle.com/datasets/xhlulu/covidqa
- https://www.kaggle.com/datasets/narendrageek/covid19-frequent-asked-questions
- https://github.com/deepset-ai/COVID-QA/blob/master/data/question-answering/COVID-QA.json

# Data cleaning and Preprocessing

Question-Answer Pairs and COVID-QA documents were added to the ElasticSearch DB.

The preprocessing consisted into removing headers,footers,whitespaces and then splitting all the documents into shards of 100 tokens to improve inference time.

# The Extractive Solution

The system uses the Retriever-Reader paradigm

![FOoMr0SWUAMDWik](https://user-images.githubusercontent.com/100691347/229138180-0319477e-7e92-434f-b976-9c47523f2f7e.png)


It consists into three main components: 
  1.  the DB which contains the Knowledge, usually consisting in unstructured data,as in our case.
  2.  the Retriever, which usually uses a sparse representation (BoW,TF-IDF,BM25) of the data or a dense one (embeddings) to compare the question of the user with each document in the knowledge base to retrieve the most relevant.
  3. the Reader, which usually consists into a transformer as in our case, that given a question and a context extracts the answer from the context and returns it.
  
  For the DB component, a production-ready ElasticSearch DB was used due to its scalability, capability of storing unstructured data and both sparse/dense retrieval support.
  
  For what regards the other two components, some different models were evaluated for the Retriever and Reader components
| Model | Type | Recall Top_k = 1| Recall Top_k = 5 | Recall Top_k = 10 |
|-------|-----------|--------|--------|--------|
| - | BM25 (Sparse) | 62.5% | 83.3% | 89.4% |
| multi-qa-mpnet-base-dot-v1 | EmbeddingRetriever (Dense) | 32.5% | 57.1% | 67.3% |
| dpr-question_encoder-single-nq-base and dpr-ctx_encoder-single-nq-base | Dense Passage Retriever (Dense) | 19.7% | 36.9% | 47.5% |


EmbeddingRetriever was then fine-tuned with the following hyperparameters, to produce the following enhancement:

Training Hyperparameters:
```
 batch_size=16,
 learning_rate=3e-05,
 n_epochs=3

```

| Model | Type | Recall Top_k = 1| Recall Top_k = 5 | Recall Top_k = 10 |
|-------|-----------|--------|--------|--------|
| multi-qa-mpnet-base-dot-v1 | EmbeddingRetriever (Dense) Fine-Tuned | 60% | 81.2% | 87.4% |


Due to limited computing power on AWS EC2 and lack of a GPU, 'minilm-uncased' pre-trained on SQuAD 2 by deepset was chose due to fast inference time and then fine-tuned on the COVID-QA dataset to improve its performance on our specific task.

The model was open-sourced and can be found here: https://huggingface.co/Frizio/minilm-uncased-squad2-covidqa

# The Generative Solution

For the Generative Solution, the Reader was replaced with a BART (Encoder-Decoder) Generator pre-trained on posts of three subreddits: r/explainlikeimfive, r/AskHistorians, and r/askscience. 
The Difference between an Extractive model and a generative ones lies in how the model produces its output: the extractive model extracts it from the context while the generator generates it from scratch.

Follows a pair of examples that highlights advantages and disadvantages of a generative approach :

```
Question:What enzymes have been reported to be linked with severity of infection and various pathological conditions caused by microorganisms?
Answer:cysteine proteases
Generated Answer:I'm not sure if this is what you're looking for, but there are a few enzymes that have been shown to be associated with increased susceptibility to certain infections. The most well-known of these is the cysteine-protease inhibitor (CPI), which has been used to treat a variety of bacterial infections.

Question:Should I wear mask if I'm asymptomatic?
Answer: Masks are also strongly recommended for those who may have been infected and those taking care of someone who may have the disease
Generated Answer:If you are asymptomatic, then yes, you should wear a mask. If you are contagious, then no.
```

The model is capable of complex phrases generation but its main limit, excluding its long inference time, is its tendency to hallucinate and produce completely wrong answers that, in our context, could be very harmful if taken seriously by the user.

Extractive and FAQ Models rarely produce any convincing answer when they fail to find one with an high confidence score, a generative model instead will more often than not produce a credible and completely wrong answer and this can dramatically increase the chance of it being taken seriously by the user.

# The FAQ Solution
For the extractive and generative approaches an highly technical dataset made of scientific papers was considered. In this part of the project however, we will focus on a different system that uses 6 different datasets to build a system that can answer to the more common and less technical questions about COVID-19.

The FAQ Pipeline consists in two components:
1. A DB containing question-answer pairs
2. A Dense Retriever component

The main difference between the other two approaches is the lack of a reader. The Retriever, given a query from the user, searches the most semantically and syntactically similar question from its knowledge base and returns the corresponding answer.


For what concerns our use-case,when a set of question-answer pairs is all we have (no large corpus), with a good amount of data (roughly 9k question-answer pairs), ,this approach can easily out-perform the other two for a fraction of the cost:

| Approach |Large corpus search needed | Answer Reliability | Inference Time |
|-------|-----------|--------|--------|
| Extractive | Yes | Medium | Medium |
| Generative | Yes | Medium | High |
| FAQ | No | High | Low |

For what regards the COVID-QA dataset instead, a FAQ approach is completely undoable due to its impossibility to generalize while talking about complex topics.

# API Deployment

For the API Deployment, the last use-case (FAQ) was chosen due to its better capability of answering more common questions.

The deployment was done on a AWS EC2 t2.large machine (8 GB RAM, 2 vCPU) using ElasticSearch and Haystack APIs to provide a REST API endpoint to load data and perform inference.

A simple front-end HTML+JS page was built to interact with the system

<img width="941" alt="image" src="https://user-images.githubusercontent.com/100691347/229165544-4c842c60-0b15-4a00-8e19-4c591cd8cad1.png">

