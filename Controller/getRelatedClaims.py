import sqlite3


def get_related_claims(first_claim_id):
    conn = sqlite3.connect('debate.sqlite')
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
SELECT c.claimID, c.text, u.userName, c.creationTime, c.updateTime, type.claimRelType
FROM claim c
INNER JOIN claimToClaim c2c ON c.claimID = c2c.second
INNER JOIN user u ON c.postingUser = u.userID
INNER JOIN claimToclaimType type ON c2c.claimRelType = type.claimRelTypeId
WHERE c2c.first = ?

''', (first_claim_id,))

        related_claims = [row for row in cursor.fetchall()]
        
    
        conn.close()
        
        return related_claims, None  # Return the list of related claims
    except Exception as e:
        conn.close()
        return None, str(e)  # Return error message