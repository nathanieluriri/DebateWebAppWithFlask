# Function to insert a user into the database
import sqlite3


def insert_user_to_db(userName, passwordHash, isAdmin, creationTime, lastVisit):
    conn = sqlite3.connect('debate.sqlite')  # Replace with your database path
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO user (userName, passwordHash, isAdmin, creationTime, lastVisit) 
        VALUES (?, ?, ?, ?, ?)
    ''', (userName, passwordHash, isAdmin, creationTime, lastVisit))
    conn.commit()  # Commit the changes to the database
    userId = cursor.lastrowid
    
    conn.close()  # Close the connection
    return userId


def user_exists_in_db(userName):
    # Assuming you are using a database connection, e.g., SQLite, MySQL, PostgreSQL
    # This is a simple SQL query to check if a user exists by username
    query = "SELECT COUNT(*) FROM user WHERE userName = ?"
    conn = sqlite3.connect('debate.sqlite')  # Replace with your database path
    cursor = conn.cursor()
    try:
        # Assuming you have a database connection object `db` and a cursor `cursor`
        cursor.execute(query, (userName,))
        result = cursor.fetchone()
        return result[0] > 0  # If count is greater than 0, username exists
    except Exception as e:
        # Handle DB errors
        print(f"Error checking if user exists: {str(e)}")
        return False
