
# Function to insert data into claimToClaim table
import sqlite3


def insert_claim_to_claim(first_claim_id, second_claim_id, claim_rel_type):
    conn = sqlite3.connect('debate.sqlite')
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO claimToClaim (first, second, claimRelType)
            VALUES (?, ?, ?)
        ''', (first_claim_id, second_claim_id, claim_rel_type))
        
        conn.commit()
        conn.close()
        return True, None  # Success
    except sqlite3.IntegrityError as e:
        conn.close()
        return False, str(e)  # Integrity error, such as duplicate relationship
    except Exception as e:
        conn.close()
        return False, str(e)  # General error
    




# Function to get the relationship type ID based on the type (Opposed or Equivalent)
def get_relationship_type_id(relationship_type):
    conn = sqlite3.connect('debate.sqlite')
    cursor = conn.cursor()

    # Query the claimToClaimType table to get the relationship type ID
    cursor.execute('''
        SELECT claimRelTypeID FROM claimToClaimType WHERE claimRelType = ?
    ''', (relationship_type,))

    relationship_type_id = cursor.fetchone()
    conn.close()

    if relationship_type_id:
        return relationship_type_id[0]  # Return the ID of the relationship type
    return None  # If the relationship type is invalid, return None

