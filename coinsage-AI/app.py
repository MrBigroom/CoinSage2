from flask import Flask, request, jsonify
import os
import joblib
import pandas as pd

app = Flask(__name__)

try:
    model = joblib.load('models/transaction_classifier.pkl')
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/categorise', methods=['POST'])
def categorise_transaction():
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.json
        title = data.get('title', '')
        amount = data.get('amount', 0.0)

        features = f"{title} {amount}"

        predicted_category = model.predict([features])[0]
        confidence = model.predict_proba([features])[0].max()

        return jsonify({
            'category': predicted_category,
            'confidence': float(confidence)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)