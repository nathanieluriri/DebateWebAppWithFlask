
# Function to insert topic data into the database
import sqlite3
import time


def insert_topic_data(user_id, topic_name):
    conn = sqlite3.connect('debate.sqlite')
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO topic (topicName, postingUser, creationTime, updateTime)
        VALUES (?, ?, ?, ?)
    ''', (topic_name, user_id, int(time.time()), int(time.time())))
    
    conn.commit()
    conn.close()