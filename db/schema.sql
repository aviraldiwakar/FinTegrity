-- ==========================================
-- FinTegrity Database Schema
-- SQL Dialect: PostgreSQL (v14+)
-- ==========================================

-- Clean up existing tables safely
DROP TABLE IF EXISTS emis CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- 1. Create Customers Registry Table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cibil_score INT NOT NULL CHECK (cibil_score BETWEEN 300 AND 900),
    monthly_income NUMERIC(12, 2) NOT NULL CHECK (monthly_income >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for search performance on email and credit ratings
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_cibil ON customers(cibil_score);

-- 2. Create Loan Applications Table
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    loan_amount NUMERIC(12, 2) NOT NULL CHECK (loan_amount > 0),
    emi_amount NUMERIC(12, 2) NOT NULL CHECK (emi_amount >= 0),
    tenure_months INT NOT NULL CHECK (tenure_months IN (6, 12, 24, 36)),
    loan_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (loan_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    originated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loans_customer ON loans(customer_id);
CREATE INDEX idx_loans_status ON loans(loan_status);

-- 2. Create EMI Ledger/Transactions Table
CREATE TABLE emis (
    id SERIAL PRIMARY KEY,
    loan_id INT NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    due_date DATE NOT NULL,
    payment_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'LATE')),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emis_loan ON emis(loan_id);
CREATE INDEX idx_emis_status ON emis(status);
CREATE INDEX idx_emis_due_date ON emis(due_date);
