

import sqlite3


def query_db(query, args=()):
    # Connect to the SQLite database
    conn = sqlite3.connect('debate.sqlite')  
    conn.row_factory = sqlite3.Row  
    cur = conn.cursor()
    cur.execute(query, args) 
    result = cur.fetchall()  
    conn.close()  
    return [dict(row) for row in result]  