import sqlite3
import pprint

def get_replies_by_claim_id(claim_id):
    db_connection = sqlite3.connect('debate.sqlite')

    query = """
    SELECT r.replyTextID,  r.creationTime, r.text,u.userName , rtrt.claimReplyType
    FROM replyText r
    JOIN replyToClaim rtc ON r.replyTextID = rtc.reply
    LEFT JOIN user u ON r.postingUser = userId
    LEFT JOIN replyToClaimType rtrt ON rtrt.claimReplyTypeID  = rtc.replyToClaimRelType
    WHERE rtc.claim = ?;
    """
    
    cursor = db_connection.cursor()
    cursor.execute(query, (claim_id,))
    replies = cursor.fetchall()
    
    
    db_connection.close()
    return replies


def get_replies_by_parent_id(parent_id):
    db_connection = sqlite3.connect('debate.sqlite')

    query = """
    SELECT r.replyTextID,  r.creationTime, r.text,u.userName, rtrt.replyReplyType , pu.userName
    FROM replyText r
    JOIN replyToReply rtr ON r.replyTextID = rtr.reply
    LEFT JOIN user u ON r.postingUser = u.userId
    LEFT JOIN replyText rp ON rtr.parent = rp.replyTextID 
    LEFT JOIN user pu ON rp.postingUser = pu.userId
    LEFT JOIN replyToReplyType rtrt ON rtrt.replyReplyTypeID = rtr.replyToReplyRelType
    WHERE rtr.parent = ?;
    """
    
    cursor = db_connection.cursor()
    cursor.execute(query, (parent_id,))
    replies = cursor.fetchall()
    db_connection.close()
    return replies




# Example: Retrieve replies for a specific claim ID
# claim_id = 4
# replies_by_claim = get_replies_by_claim_id( claim_id)
# pprint.pprint(f"Replies for claim {claim_id}: {replies_by_claim} lenght ==== {replies_by_claim.__len__()}")

# Example: Retrieve replies for a specific parent reply ID
# parent_id = 11
# replies_by_parent = get_replies_by_parent_id( parent_id)
# pprint.pprint(f"Replies to parent {parent_id}: {replies_by_parent} lenght ==== {replies_by_parent.__len__()}")
