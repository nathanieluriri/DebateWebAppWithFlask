from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Function to get related claims
def get_related_claims(first_claim_id):
    conn = sqlite3.connect('debate.sqlite')
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT second FROM claimToClaim WHERE first = ?
        ''', (first_claim_id,))
        
        related_claims = [row[0] for row in cursor.fetchall()]  # Fetch all results
        conn.close()
        
        return related_claims, None  # Return the list of related claims
    except Exception as e:
        conn.close()
        return None, str(e)  # Return error message

# Flask endpoint to fetch related claims
@app.route('/get_related_claims', methods=['POST'])
def fetch_related_claims():
    # Ensure request is AJAX (JSON)
    if not request.is_json:
        return jsonify({"error": "Invalid request. Only JSON requests are allowed."}), 400
    
    data = request.get_json()
    
    # Validate required field
    if 'first_claim_id' not in data:
        return jsonify({"error": "Missing required field: first_claim_id"}), 400
    
    first_claim_id = data['first_claim_id']
    
    # Fetch related claims
    related_claims, error = get_related_claims(first_claim_id)
    
    if error:
        return jsonify({"error": error}), 500  # Return server error response
    
    if not related_claims:
        return jsonify({"message": "No related claims found for the given first claim."}), 404
    
    return jsonify({"related_claims": related_claims}), 200  # Return successful response

if __name__ == '__main__':
    app.run(debug=True)
