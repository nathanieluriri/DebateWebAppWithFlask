from datetime import timedelta
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
from Controller.updateClaim import update_claim_updateTime
from Controller.updateLastVisit import update_last_visit
from Controller.userDb import insert_user_to_db, user_exists_in_db
from doc_routes import docs

app = Flask(__name__)
app.secret_key = "helloworld"
app.register_blueprint(docs, url_prefix="/docs")
app.permanent_session_lifetime = timedelta(days=7)


# Home route
@app.route("/", methods=["GET"])
def home():
    if request.is_json:
        return ""
    return render_template("index.html")


# Topic route
@app.route("/<string:topic>", methods=["GET"])
def topic(topic):
    return render_template("topic.html", topic=topic)


# Catch-all route for nested claims
@app.route("/<string:topic>/<path:claimpath>", methods=["GET"])
def claim(topic, claimpath):
    return render_template("claim.html", topic=topic, claimpath=claimpath)


# Route to fetch all topics
@app.route("/get_all_topics", methods=["GET"])
def get_all_topics():
    query = """
        SELECT topicID, topicName, postingUser, creationTime, updateTime 
        FROM topic
    """
    topics = query_db(query)

    if topics:
        return jsonify(topics)  # Return the list of topics as JSON
    else:
        return jsonify({"error": "No topics found"}), 404


# Flask endpoint to create a topic
@app.route("/create_topic", methods=["POST"])
def create_topic():
    try:
        if not session['userID']:
            print("_________________________________________________")
            return redirect(url_for('home'))
    except KeyError:
        return redirect(url_for('home'))

    data = request.get_json()  # Extract data from the POST request

    if not data or "topic_name" not in data:
        return jsonify({"error": " topic_name"}), 400

    user_id = session["userID"]
    topic_name = data["topic_name"]

    try:
        insert_topic_data(user_id, topic_name)
        return jsonify({"message": "Topic created successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Flask endpoint to handle the creation of a claim relationship
@app.route("/create_claim_relationship", methods=["POST"])
def create_claim_relationship():
    try:
        ui = session['userID']
    except KeyError:
        return redirect(url_for('home'))
    data = request.get_json()  # Extract data from the POST request
    # Extract data from the request
    
    topicID =data.get("topicID")
    
    userID = session['userID']
    claimText = data.get("text")
    first_claim= data.get("claimID")
    update_claim_updateTime(first_claim)


    # Validate that all required fields are present
    if not claimText:
        return jsonify({"error": " topicID, claimID and text is required"}), 400

    # Call the function to insert the claim into the database

    try:
        # Validate required fields
        if not data  or "claimRelType" not in data:
            return (
                jsonify({"error": "Missing required fields: claimRelType"}),
                400,
            )

      
        
        second_claim_id = insert_claim(topicID, userID, claimText)
        claim_rel_type = data["claimRelType"]
        if "e" in claim_rel_type:
            claim_rel_type = 2
        else:
            claim_rel_type = 1
        # Insert into the database
        success, error_message = insert_claim_to_claim(
            first_claim, second_claim_id, claim_rel_type
        )

        if success:
            return jsonify({"message": "Claim relationship created successfully!"}), 201
        else:
            return jsonify({"error": error_message}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return error if something goes wrong


# Flask endpoint to fetch related claims
@app.route("/get_related_claims", methods=["POST"])
def fetch_related_claims():
    # Ensure request is AJAX (JSON)
    if not request.is_json:
        return (
            jsonify({"error": "Invalid request. Only JSON requests are allowed."}),
            400,
        )

    data = request.get_json()

    # Validate required field
    if "first_claim_id" not in data:
        return jsonify({"error": "Missing required field: first_claim_id"}), 400

    first_claim_id = data["first_claim_id"]
    
 


    # Fetch related claims
    related_claims, error = get_related_claims(first_claim_id)

    if error:
        return jsonify({"error": error}), 500  # Return server error response

    if not related_claims:
        return (
            jsonify([]),
            200,
        )
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

    return (
        jsonify(formatted_replies),
        200,
    )  # Return successful response


# Route to handle user creation (POST request)
@app.route("/create_user", methods=["POST"])
def create_user():
    # Get data from the request body
    data = request.get_json()

    userName = data.get("userName")
    password = data.get("password")
    isAdmin = data.get("isAdmin", 0)  # Default to normal user if not specified

    if not userName or not password:
        return jsonify({"error": "Username and password are required"}), 400

    # Check if the username already exists in the database
    if user_exists_in_db(userName):  # Implement user_exists_in_db() to check the DB
        return jsonify({"error": "Username already exists"}), 409  # 409 Conflict

    # Hash the password using PBKDF2 with SHA-256
    passwordHash = hash_password_pbkdf2(password)

    # Get current Unix timestamp for creationTime and lastVisit
    creationTime = int(time.time())
    lastVisit = creationTime  # Assume lastVisit is the same as creationTime

    # Insert user into the database
    try:
        user_id = insert_user_to_db(
            userName, passwordHash, isAdmin, creationTime, lastVisit
        )
        session["userID"] = user_id
        return (
            jsonify({"message": "User created successfully"}),
            201,
        )  # 201 Created status
    except Exception as e:
        return (
            jsonify({"error": str(e)}),
            500,
        )  # Return error message if something goes wrong


# Login route to authenticate the user and update last visit
@app.route("/login", methods=["POST"])
def login_user():
    # Get data from the request body
    data = request.get_json()

    userName = data.get("userName")
    password = data.get("password")

    if not userName or not password:
        return jsonify({"error": "Username and password are required"}), 400

    # Query the database for the user by username
    query = """
        SELECT userID, userName, passwordHash FROM user WHERE userName = ?
    """
    users = query_db(query, [userName])

    if not users:
        return jsonify({"error": "User not found"}), 404

    user = users[0]  # Assuming the user exists and we only have one result

    # Verify the password
    if not verify_password(user["passwordHash"], password):
        return jsonify({"error": "Invalid password"}), 401

    # Update the last visit timestamp for the user
    update_last_visit(user["userID"])
    session.permanent = True 

    # Return a success response
    session["userID"] = user["userID"]
    

    return jsonify({"message": "Login successful", "userID": user["userID"]}), 200


@app.route("/logout")
def logout():
    session.pop("userID", None)
   
    return redirect(url_for("home"))


# Endpoint to create a claim
@app.route("/create_claim", methods=["POST"])
def create_claim():
    try:
        ui = session['userID']
    except KeyError:
        return redirect(url_for('home'))
    # Parse the JSON data from the request
    
    data = request.get_json()

    # Extract data from the request
    topicID = data.get("topicID")
   
    try:
        userID = session["userID"]
    except KeyError:
        return redirect(url_for('home'))
    claimText = data.get("text")


    # Validate that all required fields are present
    if not claimText:
        return jsonify({"error": "topicID and text is required"}), 400

    # Call the function to insert the claim into the database
    try:
        insert_claim(topicID, userID, claimText)
        return (
            jsonify({"message": "Claim created successfully"}),
            201,
        )  # 201 Created status
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return error if something goes wrong


# Endpoint to get claims for a specific topic
@app.route("/get_claims_for_topic/<int:topicID>", methods=["GET"])
def get_claims_for_topic_endpoint(topicID):
    # Fetch claims for the given topicID
    
    claims = get_claims_for_topic(topicID)

    # If no claims are found, return an error
    if not claims:
        return jsonify({"error": "No claims found for this topic"}), 404

    # Convert claims to a list of dictionaries for JSON response
    claims_data = [
        {
            "claimID": claim[0],
            "topic": claim[1],
            "postingUser": claim[2],
            "creationTime": claim[3],
            "updateTime": claim[4],
            "text": claim[5],
        }
        for claim in claims
    ]

    # Return the claims as JSON
    return jsonify(claims_data)


# Endpoint to get the total number of claims for each topic
@app.route("/get_claim_count_per_topic", methods=["GET"])
def get_claim_count_per_topic_endpoint():
    # Call the function to get the claim count for each topic
    if not request.is_json:
        return jsonify({"error": "Request must be in JSON format"}), 400
    topic_claim_counts = get_claim_count_per_topic()

    # If no claims are found, return an error message
    if not topic_claim_counts:
        return jsonify({"error": "No topics found or no claims available"}), 404

    # Convert the result into a list of dictionaries for JSON response
    claims_count_data = [
        {
            "topicID": topic[0],  # topic ID
            "total_claims": topic[1],  # total claims for the topic
        }
        for topic in topic_claim_counts
    ]

    # Return the claim counts as JSON
    return jsonify(claims_count_data)


@app.route("/create_reply", methods=["POST"])
def create_reply():
    try:
        ui = session['userID']
    except KeyError:
        return redirect(url_for('home'))
    # Get the data from the request
    
    
    
    
    data = request.get_json()

    reply_text = data.get("text")
    user_id = session["userID"]
    reply_type = data.get("replyType")
    relationship_type = data.get("relationshipType")
    first_claim= data.get("claimID")
    update_claim_updateTime(first_claim)

    # Ensure that the required fields are provided
    if not reply_text  or not reply_type or not relationship_type:
        return jsonify({"error": "Missing required fields"}), 400

    # Get the current Unix timestamp for creationTime
    creation_time = int(time.time())

    # Insert the reply into the replyText table
    reply_id = insert_reply(reply_text, user_id, creation_time)

    # Get the reply type ID based on the user's relationship type
    reply_type_id = get_reply_type_id(reply_type, relationship_type)
    if reply_type_id is None:
        return (
            jsonify(
                {
                    "error": f"Invalid relationship type: {relationship_type} for {reply_type}"
                }
            ),
            400,
        )

    # Check whether it's a reply to a claim or a reply to another reply
    if reply_type == "claim":
        claim_id = data.get("claimID")  # Get the claimID
        if not claim_id:
            return jsonify({"error": "Missing claimID for reply to claim"}), 400

        # Insert into the replyToClaim table with the correct replyTypeID
        insert_reply_to_claim(reply_id, claim_id, reply_type_id)

    elif reply_type == "reply":
        parent_reply_id = data.get("parentReplyID")  # Get the parent reply ID
        if not parent_reply_id:
            return jsonify({"error": "Missing parentReplyID for reply to reply"}), 400

        # Insert into the replyToReply table with the correct replyTypeID
        insert_reply_to_reply(reply_id, parent_reply_id, reply_type_id)

    else:
        return jsonify({"error": 'Invalid replyType. Must be "claim" or "reply"'}), 400

    # Return a success message
    return jsonify({"message": "Reply created successfully"}), 201



# Flask endpoint to fetch replies by claim_id
@app.route("/get_replies_by_claim_id", methods=["POST"])
def fetch_replies_by_claim_id():
    # Ensure request is AJAX (JSON)
    if not request.is_json:
        return jsonify({"error": "Invalid request. Only JSON requests are allowed."}), 400

    data = request.get_json()

    # Validate required field
    if "claim_id" not in data:
        return jsonify({"error": "Missing required field: claim_id"}), 400

    claim_id = data["claim_id"]

    # Fetch replies by claim_id
    replies = get_replies_by_claim_id(claim_id)

    if not replies:
        return jsonify({"message": "No replies found for the given claim."}), 404

    # Format the replies (optional: you can transform the data here if needed)
    formatted_replies = [
        {
            "replyTextID": reply[0],
            "creationTime": reply[1],
            "text": reply[2],
            "userName": reply[3],
            "relationshipType": reply[4],
            "hasChild":get_replies_by_parent_id(reply[0])!=[]
        }
        for reply in replies
    ]

    return jsonify({"replies": formatted_replies}), 200


# Flask endpoint to fetch replies by parent_id
@app.route("/get_replies_by_parent_id", methods=["POST"])
def fetch_replies_by_parent_id():
    # Ensure request is AJAX (JSON)
    if not request.is_json:
        return jsonify({"error": "Invalid request. Only JSON requests are allowed."}), 400

    data = request.get_json()

    # Validate required field
    if "parent_id" not in data:
        return jsonify({"error": "Missing required field: parent_id"}), 400

    parent_id = data["parent_id"]

    # Fetch replies by parent_id
    replies = get_replies_by_parent_id(parent_id)

    if not replies:
        return jsonify({"message": "No replies found for the given parent."}), 404

    # Format the replies (optional: you can transform the data here if needed)
    formatted_replies = [
        {
            "replyTextID": reply[0],
            "creationTime": reply[1],
            "text": reply[2],
            "userName": reply[3],
            "relationshipType": reply[4],
            "parentUserName": reply[5],
            "hasChild":get_replies_by_parent_id(reply[0])!=[]
        }
        for reply in replies
    ]

    return jsonify({"replies": formatted_replies}), 200


@app.route("/docs")
def docs():
    sa = []
    for rule in app.url_map.iter_rules():
        if "i." in rule.endpoint:
            sa.append(f"Route: {rule.rule},  ")

    return jsonify(sa)


if __name__ == "__main__":

    app.run(debug=True)
