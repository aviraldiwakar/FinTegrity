-- ==========================================
-- FinTegrity Mock Database Seeding
-- PostgreSQL Seeding Script
-- ==========================================

-- 1. Insert Profile Registries
INSERT INTO customers (first_name, last_name, email, cibil_score, monthly_income) VALUES
('Harsh', 'Verma', 'h.verma@enterprise.com', 780, 85000.00),
('Ananya', 'Sen', 'ananya.sen@creditops.net', 610, 42000.00),
('Rajesh', 'Mehta', 'rajesh.mehta@fintech.org', 740, 25000.00);

-- 2. Insert Approved Loan Instance for Harsh Verma (id=1)
-- Loan Principal: ₹5,00,000, 36 months tenure, 10.5% flat rate = ₹5,52,500 total, EMI = ₹15,277.78
INSERT INTO loans (id, customer_id, loan_amount, emi_amount, tenure_months, loan_status) VALUES
(101, 1, 500000.00, 15277.78, 36, 'APPROVED');

-- 3. Insert EMI Installment Due dates for Harsh Verma
INSERT INTO emis (loan_id, amount, due_date, payment_date, status) VALUES
(101, 15277.78, '2026-07-19', NULL, 'PENDING'),
(101, 15277.78, '2026-08-19', NULL, 'PENDING'),
-- Past due installment to showcase late warning / anomaly classification
(101, 15277.78, '2026-05-15', NULL, 'PENDING');
