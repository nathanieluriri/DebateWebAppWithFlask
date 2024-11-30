import sqlite3

def update_claim_updateTime( claimID):

    try:
        # Connect to the SQLite database
        connection = sqlite3.connect('debate.sqlite')
        cursor = connection.cursor()

        # Execute the update query
        cursor.execute('''
            UPDATE claim
            SET updateTime = strftime('%s', 'now')  -- Set the current Unix timestamp
            WHERE claimID = ?;
        ''', (claimID,))

        # Commit the changes
        connection.commit()
        print(f"Claim with ID {claimID} successfully updated.")

    except sqlite3.Error as e:
        print(f"An error occurred: {e}")

    finally:
        # Close the connection
        if connection:
            connection.close()

