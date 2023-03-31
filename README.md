# Stack Overflow Questions Tag Prediction
A questions tag predictor based on the StackSample dataset.
The objective is to build a model which can assign 1+ tags to a SO question automatically.


# The Dataset
The StackSample dataset contains roughly 10% of the questions on Stack Overflow, with body text, titles, answers, tags and scores for each item (plus some additional data that we won't use in this specific case).

It contains roughly 1.2M rows and each question is associated with 1 or more tags.


# Data cleaning and Preprocessing

The dataset contains too much data to be processed in a short time on Colab Free hardware, so we just take 1% of the questions (12k items) but we have to be sure that the selected questions are the best possible for the model training.
To do so, we filter the dataset by removing all the questions with a score < 5. Negative scores in particular are often symptomatic of erroneous or wrong questions.
After that we sort the rows by the occurrence count of each tag so that we will have a good number of examples for each tag. and finally select the first 12643 questions with the first top 430 tags.

For what regards preprocessing, the title and body of each question gets stripped of punctuation, numbers and HTML tags and then, with spaCy library, it gets cleaned of stopwords, tokenized and lemmatized.


# The Model

Since we want the model to be able of assigning 1+ tags to each question, we are dealing with a multi-label classification and so we need a wrapper for our models (in this case OneVsRestClassifier by Scikit).

Three models were considered for this task: Logistic Regression, Support Vector Machine Classifier, Artificial Neural Network.

The execution of some other models was attempted too (XGBoost and LSTM Neural Network) but these needed too much computational power to converge in a reasonable amount of time so their performance won't be further discussed.

Test size is 20% of the dataset

For comparison purposes, a random decision model would have an accuracy of roughly 0.23%, so its accuracy would be 210 times worse than the ANN and 65 times worse than the Logistic Regression.

| Model  | Test Performance (Accuracy) | Test Performance (Precision Score) | Test Performance (Recall Score) | Test Performance (F1 Score) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| Logistic Regression  | 15.02%  | 88.44%  | 23.72%  | 37.41%  |
| SVM | 21.89%  | 90.11% |  33.07% |  48.39% |
| ANN | 48.01% | 63.49% |  49.75% | 49.17% |
