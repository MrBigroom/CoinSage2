from flask import Flask, request, jsonify
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
        description = data.get('description', '')
        amount = data.get('amount', 0.0)

        features = f"{description} {amount}"

        predicted_category = model.predict([features])[0]
        confidence = model.predict_proba([features])[0].max()

        return jsonify({
            'category': predicted_category,
            'confidence': float(confidence)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)