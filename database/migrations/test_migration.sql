-- Test Migration Validation Script
-- Run after executing migrate_leads_to_crm.sql

-- ======================
-- 1. COUNT VERIFICATION
-- ======================

SELECT 'Leads Count' AS test, COUNT(*) AS count FROM leads;
SELECT 'Opportunities Count' AS test, COUNT(*) AS count FROM opportunities;
SELECT 'Expected Match' AS test, 'Leads should equal Opportunities (approx)' AS description;

SELECT 'Quote Submissions Count' AS test, COUNT(*) AS count FROM quote_submissions;
SELECT 'Customers from Sellers' AS test, COUNT(*) AS count 
FROM customers 
WHERE customer_type = 'seller';

-- ======================
-- 2. INTEGRITY CHECKS
-- ======================

-- Check for orphaned opportunities
SELECT 'Orphaned Opportunities' AS test, COUNT(*) AS count
FROM opportunities o
LEFT JOIN customers c ON c.id = o.customer_id
WHERE c.id IS NULL;
-- Expected: 0

-- Check for NULL customer_ids
SELECT 'NULL customer_ids' AS test, COUNT(*) AS count
FROM opportunities
WHERE customer_id IS NULL;
-- Expected: 0

-- Check foreign keys
SELECT 'Invalid partner_id in opportunities' AS test, COUNT(*) AS count
FROM opportunities o
LEFT JOIN partners p ON p.id = o.partner_id
WHERE o.partner_id IS NOT NULL AND p.id IS NULL;
-- Expected: 0

-- ======================
-- 3. DATA PRESERVATION
-- ======================

-- Verify commission amounts preserved
SELECT 'Total Commission in Leads' AS test, SUM(commission_amount) AS total
FROM leads;

SELECT 'Total Commission in Opportunities' AS test, SUM(commission_amount) AS total
FROM opportunities;
-- Expected: Should match

-- Verify stage mapping
SELECT 
  'Stage Mapping' AS test,
  stage,
  COUNT(*) AS count
FROM opportunities
GROUP BY stage
ORDER BY stage;

-- ======================
-- 4. SAMPLE DATA CHECK
-- ======================

-- Show sample migrated records
SELECT 
  'Sample Records' AS test,
  o.id AS opp_id,
  o.title,
  c.full_name AS customer,
  c.whatsapp,
  o.stage,
  o.estimated_value,
  o.partner_id
FROM opportunities o
JOIN customers c ON c.id = o.customer_id
LIMIT 10;

-- ======================
-- 5. SUMMARY
-- ======================

SELECT 
  (SELECT COUNT(*) FROM customers) AS total_customers,
  (SELECT COUNT(*) FROM opportunities) AS total_opportunities,
  (SELECT COUNT(*) FROM activities) AS total_activities,
  (SELECT COUNT(*) FROM tasks) AS total_tasks;
