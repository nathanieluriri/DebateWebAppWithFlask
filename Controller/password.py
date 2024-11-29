

# Function to hash password using PBKDF2 with SHA-256
import hashlib
import os
import sqlite3
import time


def hash_password_pbkdf2(password):
    # Generate a random salt (16 bytes)
    salt = os.urandom(16)
    
    # Hash the password using PBKDF2 with SHA-256

    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    
    # Return salt and password hash together (for later verification)
    return salt + password_hash



# Function to verify the user's password (compare hash with stored hash)
def verify_password(stored_password_hash, input_password):
    # The first 16 bytes of the stored hash are the salt
    salt = stored_password_hash[:16]
    stored_hash = stored_password_hash[16:]
    # Recompute the hash with the provided password and the stored salt
    computed_hash = hashlib.pbkdf2_hmac('sha256', input_password.encode('utf-8'), salt, 100000)
    # Compare the stored hash with the computed hash
    return stored_hash == computed_hash


