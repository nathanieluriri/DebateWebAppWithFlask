import sqlite3


REPLY_TYPE_MAPPER = {
    "claim": {
        "Supporting Argument": 1,
        "Clarification": 2,
        "Counterargument": 3
    },
    "reply": {
        "Evidence": 1,
        "Rebuttal": 2,
        "Further Explanation": 3
    }
}


# Function to insert a reply into the replyText table
def insert_reply(reply_text, user_id, creation_time):
    conn = sqlite3.connect('debate.sqlite')  # Replace with your database path
    cursor = conn.cursor()
    
    # Insert the reply text into the replyText table
    cursor.execute('''
        INSERT INTO replyText (postingUser, creationTime, text)
        VALUES (?, ?, ?)
    ''', (user_id, creation_time, reply_text))
    
    # Get the ID of the inserted reply
    reply_id = cursor.lastrowid
    conn.commit()  # Commit the changes
    conn.close()
    
    return reply_id

# Function to associate the reply with a claim (in replyToClaim table)
def insert_reply_to_claim(reply_id, claim_id, reply_type_id):
    conn = sqlite3.connect('debate.sqlite')
    cursor = conn.cursor()
    
    # Insert the relationship into the replyToClaim table
    cursor.execute('''
        INSERT INTO replyToClaim (reply, claim, replyToClaimRelType)
        VALUES (?, ?, ?)
    ''', (reply_id, claim_id, reply_type_id))
    
    conn.commit()  # Commit the changes
    conn.close()

# Function to associate the reply with another reply (in replyToReply table)
def insert_reply_to_reply(reply_id, parent_reply_id, reply_type_id):
    conn = sqlite3.connect('debate.sqlite')
    cursor = conn.cursor()
    
    # Insert the relationship into the replyToReply table
    cursor.execute('''
        INSERT INTO replyToReply (reply, parent, replyToReplyRelType)
        VALUES (?, ?, ?)
    ''', (reply_id, parent_reply_id, reply_type_id))
    
    conn.commit()  # Commit the changes
    conn.close()

# Function to get reply type ID based on user input
def get_reply_type_id(reply_type, relationship_type):
    # Look up the reply type ID based on the user input
    try:
        return REPLY_TYPE_MAPPER[reply_type][relationship_type]
    except KeyError:
        return None  # If the relationship type is not found
