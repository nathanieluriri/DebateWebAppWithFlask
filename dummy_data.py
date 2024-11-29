import sqlite3

def insert_topic_data(user_id,topic_name):
    conn = sqlite3.connect('debate.sqlite')
    cursor = conn.cursor()

    # Insert dummy data for topic table
    cursor.execute('''
        INSERT INTO topic (topicName, postingUser, creationTime, updateTime)
        VALUES (?, ?, ?, ?)
    ''', [
        (topic_name, user_id, int(time.time()), int(time.time())),
        
    ])

    # Add more insert statements as needed...
    conn.commit()
    conn.close()

import sqlite3
import time

def insert_claims():
    conn = sqlite3.connect('debate.sqlite')  # Connect to your SQLite database
    cursor = conn.cursor()

    # Insert dummy claims for the given topics
    cursor.executemany('''
        INSERT INTO claim (topic, postingUser, creationTime, updateTime, text)
        VALUES (?, ?, ?, ?, ?)
    ''', [
        # Claims for 'Debate on Climate Change' (topicID 1)
        (1, 1, int(time.time()), int(time.time()), 'Climate change is real and caused by human activities.'),
        (1, 2, int(time.time()), int(time.time()), 'There are natural cycles of climate change, and human impact is minimal.'),

        # Claims for 'Is AI a threat to humanity?' (topicID 2)
        (2, 2, int(time.time()), int(time.time()), 'AI is developing rapidly and could surpass human intelligence, becoming a threat.'),
        (2, 3, int(time.time()), int(time.time()), 'AI can be controlled and will benefit humanity in many ways, such as solving complex problems.'),

        # Claims for 'Should we colonize Mars?' (topicID 3)
        (3, 1, int(time.time()), int(time.time()), 'Colonizing Mars is essential for the survival of humanity in the long term.'),
        (3, 2, int(time.time()), int(time.time()), 'Colonizing Mars is a waste of resources and not feasible with current technology.')
    ])

    # Commit the transaction and close the connection
    conn.commit()
    conn.close()

# Call the function to insert claims
