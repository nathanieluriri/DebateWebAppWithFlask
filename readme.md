
# Flask Application

This is a Flask web application with various routes to manage topics, claims, replies, and user accounts. The application allows creating, viewing, and linking claims to topics, creating replies, managing user accounts, and viewing documentation about the available routes.

## Routes Documentation

For more information on the routes, visit the `/docs` endpoint.

## Code Overview

### Import Statements

```python
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import time
from Controller.claimToClaim import insert_claim_to_claim
from Controller.createClaim import insert_claim
from Controller.createTopic import insert_topic_data
from Controller.getClaimsFromTopicId import (
    get_claim_count_per_topic,
    get_claims_for_topic,
)
from Controller.getRelatedClaims import get_related_claims
from Controller.getReplies import get_replies_by_claim_id, get_replies_by_parent_id
from Controller.password import hash_password_pbkdf2, verify_password
from Controller.queryDb import query_db
from Controller.reply import (
    get_reply_type_id,
    insert_reply,
    insert_reply_to_claim,
    insert_reply_to_reply,
)
from Controller.updateLastVisit import update_last_visit
from Controller.userDb import insert_user_to_db, user_exists_in_db
from doc_routes import docs
```

### Flask Application Setup

```python
app = Flask(__name__)
app.secret_key = "helloworld"
app.register_blueprint(docs, url_prefix="/docs")
```

### Home Route

This is the home route that renders the `index.html` page.

```python
@app.route("/", methods=["GET"])
def home():
    if request.is_json:
        return ""
    return render_template("index.html")
```

### Topic Route

This route renders a specific topic page.

```python
@app.route("/<string:topic>", methods=["GET"])
def topic(topic):
    return render_template("topic.html", topic=topic)
```

### Claim Route

This is a catch-all route for nested claims under a specific topic.

```python
@app.route("/<string:topic>/<path:claimpath>", methods=["GET"])
def claim(topic, claimpath):
    return render_template("claim.html", topic=topic, claimpath=claimpath)
```

### API Endpoints

#### 1. Get All Topics

Fetches all topics in the database.

```python
@app.route("/get_all_topics", methods=["GET"])
def get_all_topics():
    query = """
        SELECT topicID, topicName, postingUser, creationTime, updateTime 
        FROM topic
    """
    topics = query_db(query)
    if topics:
        return jsonify(topics)
    else:
        return jsonify({"error": "No topics found"}), 404
```

#### 2. Create Topic

This endpoint allows the creation of a new topic.

```python
@app.route("/create_topic", methods=["POST"])
def create_topic():
    data = request.get_json()
    if not data or "user_id" not in data or "topic_name" not in data:
        return jsonify({"error": "Missing user_id or topic_name"}), 400
    user_id = data["user_id"]
    topic_name = data["topic_name"]
    try:
        insert_topic_data(user_id, topic_name)
        return jsonify({"message": "Topic created successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

#### 3. Create Claim Relationship

Creates a relationship between two claims.

```python
@app.route("/create_claim_relationship", methods=["POST"])
def create_claim_relationship():
    data = request.get_json()
    topicID = data.get("topicID")
    userID = data.get("userID")
    claimText = data.get("text")

    if not topicID or not userID or not claimText:
        return jsonify({"error": "topicID, userID, and text are required"}), 400

    try:
        first_claim_id = data["first"]
        second_claim_id = insert_claim(topicID, userID, claimText)
        claim_rel_type = data["claimRelType"]
        if "e" in claim_rel_type:
            claim_rel_type = 2
        else:
            claim_rel_type = 1
        success, error_message = insert_claim_to_claim(
            first_claim_id, second_claim_id, claim_rel_type
        )

        if success:
            return jsonify({"message": "Claim relationship created successfully!"}), 201
        else:
            return jsonify({"error": error_message}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

#### 4. Get Related Claims

Fetches related claims for a given claim.

```python
@app.route("/get_related_claims", methods=["POST"])
def fetch_related_claims():
    if not request.is_json:
        return jsonify({"error": "Invalid request. Only JSON requests are allowed."}), 400

    data = request.get_json()
    if "first_claim_id" not in data:
        return jsonify({"error": "Missing required field: first_claim_id"}), 400

    first_claim_id = data["first_claim_id"]
    related_claims, error = get_related_claims(first_claim_id)
    if error:
        return jsonify({"error": error}), 500
    if not related_claims:
        return jsonify({"message": "No related claims found for the given first claim."}), 404

    formatted_replies = [
        {
            "claimId": reply[0],
            "text": reply[1],
            "username": reply[2],
            "creationTime": reply[3],
            "updateTime": reply[4],
            "relationshipType": reply[5]
        }
        for reply in related_claims
    ]

    return jsonify({"related_claims": formatted_replies}), 200
```

### User Management Routes

#### 1. Create User

Handles user creation, including hashing passwords.

```python
@app.route("/create_user", methods=["POST"])
def create_user():
    data = request.get_json()
    userName = data.get("userName")
    password = data.get("password")
    isAdmin = data.get("isAdmin", 0)

    if not userName or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if user_exists_in_db(userName):
        return jsonify({"error": "Username already exists"}), 409

    passwordHash = hash_password_pbkdf2(password)
    creationTime = int(time.time())
    lastVisit = creationTime

    try:
        user_id = insert_user_to_db(
            userName, passwordHash, isAdmin, creationTime, lastVisit
        )
        session["userId"] = user_id
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

#### 2. Login

Authenticates a user and updates their last visit.

```python
@app.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()
    userName = data.get("userName")
    password = data.get("password")

    if not userName or not password:
        return jsonify({"error": "Username and password are required"}), 400

    query = """
        SELECT userID, userName, passwordHash FROM user WHERE userName = ?
    """
    users = query_db(query, [userName])
    if not users:
        return jsonify({"error": "User not found"}), 404

    user = users[0]
    if not verify_password(user["passwordHash"], password):
        return jsonify({"error": "Invalid password"}), 401

    update_last_visit(user["userID"])
    session["userId"] = user["userID"]

    return jsonify({"message": "Login successful", "userID": user["userID"]}), 200
```

#### 3. Logout

Logs the user out by clearing the session.

```python
@app.route("/logout")
def logout():
    session.pop("userId", None)
    return redirect(url_for("home"))
```

### Documentation Route

This route generates a list of available API endpoints.

```python
@app.route("/docs")
def docs():
    sa = []
    for rule in app.url_map.iter_rules():
        if "i." in rule.endpoint:
            sa.append(f"Route: {rule.rule},  ")
    return jsonify(sa)
```

### Run the Application

Finally, the Flask app is run in debug mode.

```python
if __name__ == "__main__":
    app.run(debug=True)
```

## Conclusion

This Flask application provides a simple structure to manage topics, claims, replies, and users. You can use the `/docs` endpoint to view all available API routes. Each route performs specific actions such as creating claims, replies, topics, and user management.