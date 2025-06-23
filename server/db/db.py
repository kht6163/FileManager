import sqlite3

con = sqlite3.connect("db.sqlite3")

def init_db():
    cur = con.cursor()
    
    # 테이블이 존재하는지 확인
    cur.execute("""
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='users'
    """)
    
    if cur.fetchone() is None:
        cur.execute("""
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            )
        """)
        con.commit()
        
        cur.execute("""
            INSERT INTO users (username, password) VALUES ('admin', 'admin')
        """)
        con.commit()