
import sqlite3


def get_claims_for_topic(topicID):
    conn = sqlite3.connect('debate.sqlite') 
    cursor = conn.cursor()
    
    # SQL query to fetch all claims for the given topicID
    cursor.execute('''
    SELECT c.claimID, c.topic, c.postingUser, c.creationTime, c.updateTime, c.text
    
    FROM claim c
    WHERE c.topic = ? 
    AND NOT EXISTS (
        SELECT 1
        FROM claimToClaim c2c
        WHERE c2c.second = c.claimID
    )
    ORDER BY c.updateTime DESC;
''', (topicID,))

    
    # Fetch all results
    claims = cursor.fetchall()
    
    # Close the connection
    conn.close()
    
    # Return the claims (list of tuples)
    return claims


def get_claim_count_per_topic():
    conn = sqlite3.connect('debate.sqlite')  # Replace with your database path
    cursor = conn.cursor()
    
    # SQL query to count claims grouped by topicID
    cursor.execute('''
        SELECT topic, COUNT(*) AS total_claims
        FROM claim
        GROUP BY topic
    ''')
    
    # Fetch all results
    topic_claim_counts = cursor.fetchall()
    
    # Close the connection
    conn.close()
    
    # Return the topic claim counts
    return topic_claim_counts

