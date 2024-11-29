import sqlite3
import time


def insert_claim(topicID, userID, claimText):
    conn = sqlite3.connect('debate.sqlite')  # Connect to your SQLite database
    cursor = conn.cursor()
    
    # Get current time for creation and update
    current_time = int(time.time())
    
    # Insert claim into the claim table
    cursor.execute('''
        INSERT INTO claim (topic, postingUser, creationTime, updateTime, text)
        VALUES (?, ?, ?, ?, ?)
    ''', (topicID, userID, current_time, current_time, claimText))
    
    # Commit the transaction and close the connection
    conn.commit()
    claim_id = cursor.lastrowid
    
    # Close the connection
    conn.close()
    
    # Return the ID of the inserted claim
    return claim_id