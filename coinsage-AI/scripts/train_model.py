import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import joblib

data = pd.read_csv('../data/training_data.csv')

data['features'] = data['description'] + ' ' + data['amount'].astype(str)

model = make_pipeline(
    TfidfVectorizer(max_features=1000, stop_words='english'),
    MultinomialNB()
)

model.fit(data['features'], data['category'])

joblib.dump(model, '../models/transaction_classifier.pkl')
print("Model and vectorizer saved successfully")