import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "mock_claims.db")

def setup_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS claim_invoices (
            invoice_number TEXT,
            claimant_id TEXT,
            amount REAL,
            date TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS provider_watchlist (
            provider_name TEXT PRIMARY KEY,
            risk_level TEXT,
            recent_claims_volume INTEGER
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS claimant_medical_history (
            claimant_id TEXT PRIMARY KEY,
            known_conditions TEXT,
            historical_flags TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS claimant_dependents (
            claimant_id TEXT PRIMARY KEY,
            dependent_count INTEGER
        )
    ''')
    
    cursor.execute('DELETE FROM claim_invoices')
    cursor.execute('DELETE FROM provider_watchlist')
    cursor.execute('DELETE FROM claimant_medical_history')
    cursor.execute('DELETE FROM claimant_dependents')
    
    # --- SEED SCENARIO 1: FRAUD ---
    # Claimant USER_8812 (John Doe)
    cursor.execute("INSERT INTO claim_invoices VALUES ('INV-9283', 'User_672', 12500.00, '2024-03-01')")
    cursor.execute("INSERT INTO provider_watchlist VALUES ('General City Hospital', 'High', 450)")
    cursor.execute("INSERT INTO claimant_medical_history VALUES ('USER_8812', 'Asthma', 'Frequent high-cost pharmacy claims')")
    cursor.execute("INSERT INTO claimant_dependents VALUES ('USER_8812', 49)")

    # --- SEED SCENARIO 2: NON-FRAUD ---
    # Claimant USER_1122 (Finnegan)
    cursor.execute("INSERT INTO claim_invoices VALUES ('INV-1111', 'USER_9999', 500.00, '2023-01-01')") # dummy
    cursor.execute("INSERT INTO provider_watchlist VALUES ('UAB HOSPITAL', 'Low', 12)")
    cursor.execute("INSERT INTO claimant_medical_history VALUES ('USER_1122', 'None', 'Clean History')")
    cursor.execute("INSERT INTO claimant_dependents VALUES ('USER_1122', 0)")
    
    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
