import sqlite3

def get_topic_by_id( topic_id):
    # Connect to the SQLite database
    conn = sqlite3.connect("debate.sqlite")
    conn.row_factory = sqlite3.Row  # This enables column access by name
    cursor = conn.cursor()
    
    try:
        # Query to select the topic based on the provided topic_id
        query = """
        SELECT topicID, topicName, postingUser, creationTime, updateTime
        FROM topic
        WHERE topicID = ?;
        """
        cursor.execute(query, (topic_id,))
        topic = cursor.fetchone()  # Fetch the result

        if topic:
            # Convert the result to a dictionary
            return dict(topic)
        else:
            print(f"No topic found with topicID {topic_id}")
            return None

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return None

    finally:
        cursor.close()
        conn.close()

# Example usage
