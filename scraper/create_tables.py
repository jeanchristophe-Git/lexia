"""
Creer les tables SQLite manuellement
"""

import sqlite3
import os
import re
from dotenv import load_dotenv

# Charger env
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(parent_dir, '.env')
load_dotenv(dotenv_path)

DATABASE_URL = os.getenv("DATABASE_URL")
db_path_match = re.search(r'file:(.*\.db)', DATABASE_URL)
if db_path_match:
    db_path = os.path.join(parent_dir, db_path_match.group(1).replace('./', ''))
else:
    print("[ERROR] Format DATABASE_URL invalide")
    exit(1)

print(f"[DB] Connexion a {db_path}...")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Creer les tables
print("[DB] Creation des tables...")

# Table User
cursor.execute("""
CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
)
""")

# Table Conversation
cursor.execute("""
CREATE TABLE IF NOT EXISTS Conversation (
    id TEXT PRIMARY KEY,
    userId TEXT,
    sessionId TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    confidence REAL DEFAULT 0.0,
    sources TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES User(id)
)
""")

cursor.execute("CREATE INDEX IF NOT EXISTS idx_conversation_sessionId ON Conversation(sessionId)")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_conversation_userId ON Conversation(userId)")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_conversation_createdAt ON Conversation(createdAt)")

# Table LegalDocument
cursor.execute("""
CREATE TABLE IF NOT EXISTS LegalDocument (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    articleNumber TEXT,
    contentPreview TEXT,
    sourceUrl TEXT,
    scrapedAt TEXT NOT NULL DEFAULT (datetime('now')),
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
)
""")

cursor.execute("CREATE INDEX IF NOT EXISTS idx_legaldocument_category ON LegalDocument(category)")

conn.commit()

print("[OK] Tables creees avec succes!")

# Verifier
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print(f"\n[INFO] Tables presentes: {[t[0] for t in tables]}")

cursor.close()
conn.close()
