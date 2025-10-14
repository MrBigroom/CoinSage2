import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
import joblib

try:
    data = pd.read_csv('../data/training_data.csv')
except FileNotFoundError:
    print("Error: training_data.csv not found")
    exit(1)

data['features'] = data['title'] + ' ' + data['amount'].astype(str)

X_train, X_test, y_train, y_test = train_test_split(
    data['features'], data['category'], test_size=0.2, random_state=42
)



model = make_pipeline(
    TfidfVectorizer(max_features=1000, stop_words='english'),
    MultinomialNB()
)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"Model accuracy on test set: {accuracy:.2f}")

joblib.dump(model, '../models/transaction_classifier.pkl')
print("Model and vectorizer saved successfully")