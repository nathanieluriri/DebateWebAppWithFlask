# Function to update the last visit time of the user
import sqlite3
import time


def update_last_visit(user_id):
    conn = sqlite3.connect('debate.sqlite')  # Replace with your database path
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE user SET lastVisit = ? WHERE userID = ?
    ''', (int(time.time()), user_id))
    conn.commit()
    conn.close()

