-- =====================================================
-- TAKEOFF-AUTO CRM Data Migration Script
-- =====================================================
-- This script migrates existing data from:
-- 1. leads → customers + opportunities
-- 2. quote_submissions → customers
--
-- IMPORTANT: Backup your database before running!
-- Run: mysqldump -u root -p takeoffauto_db > backup_before_migration.sql
-- =====================================================

USE takeoffauto_db;

-- =====================================================
-- STEP 1: Add migration tracking fields
-- =====================================================
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS migrated_from_lead_id INT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS migrated_from_quote_id INT;

-- =====================================================
-- STEP 2: Create customers from leads
-- =====================================================
-- Extract unique customers from leads table
-- Group by whatsapp to avoid duplicates

INSERT INTO customers (
    full_name, 
    whatsapp, 
    customer_type, 
    source, 
    source_partner_id, 
    status, 
    created_at
)
SELECT DISTINCT 
    client_name as full_name,
    client_whatsapp as whatsapp,
    'buyer' as customer_type,
    'partner' as source,
    partner_id as source_partner_id,
    CASE 
        WHEN status = 'venta_cerrada' THEN 'customer'
        WHEN status IN ('recibido', 'en_gestion') THEN 'lead'
        WHEN status = 'aprobacion_crediticia' THEN 'prospect'
        ELSE 'lead'
    END as status,
    MIN(created_at) as created_at
FROM leads
WHERE client_whatsapp IS NOT NULL 
  AND client_whatsapp != ''
GROUP BY client_whatsapp, client_name, partner_id
ORDER BY MIN(created_at) ASC;

-- Report: Customers created from leads
SELECT 
    CONCAT('✓ Created ', COUNT(*), ' customers from leads') as migration_step_1
FROM customers 
WHERE source = 'partner';

-- =====================================================
-- STEP 3: Create opportunities from leads
-- =====================================================
-- Migrate each lead to an opportunity
-- Link to the customer we just created

INSERT INTO opportunities (
    customer_id,
    car_id,
    partner_id,
    title,
    opportunity_type,
    stage,
    estimated_value,
    commission_amount,
    lost_reason_details,
    notes,
    created_at,
    updated_at,
    migrated_from_lead_id
)
SELECT 
    c.id as customer_id,
    l.car_id,
    l.partner_id,
    CONCAT(
        'Oportunidad de compra',
        CASE 
            WHEN car.brand IS NOT NULL THEN CONCAT(' - ', car.brand, ' ', car.model)
            ELSE ''
        END
    ) as title,
    'purchase' as opportunity_type,
    CASE l.status
        WHEN 'recibido' THEN 'new'
        WHEN 'en_gestion' THEN 'contacted'
        WHEN 'aprobacion_crediticia' THEN 'financing_approval'
        WHEN 'venta_cerrada' THEN 'closed_won'
        WHEN 'caida' THEN 'closed_lost'
        ELSE 'new'
    END as stage,
    car.price as estimated_value,
    l.commission_amount,
    l.caida_reason as lost_reason_details,
    l.note as notes,
    l.created_at,
    l.updated_at,
    l.id as migrated_from_lead_id
FROM leads l
INNER JOIN customers c 
    ON c.whatsapp = l.client_whatsapp 
    AND c.source_partner_id = l.partner_id
LEFT JOIN cars car 
    ON car.id = l.car_id
ORDER BY l.created_at ASC;

-- Report: Opportunities created from leads
SELECT 
    CONCAT('✓ Created ', COUNT(*), ' opportunities from leads') as migration_step_2
FROM opportunities 
WHERE migrated_from_lead_id IS NOT NULL;

-- =====================================================
-- STEP 4: Create customers from quote_submissions
-- =====================================================
-- Extract customers from quote submissions
-- Only insert if email doesn't already exist

INSERT INTO customers (
    email,
    customer_type,
    source,
    status,
    created_at,
    migrated_from_quote_id
)
SELECT DISTINCT 
    qs.email,
    'seller' as customer_type,
    'website' as source,
    'lead' as status,
    MIN(qs.created_at) as created_at,
    MIN(qs.id) as migrated_from_quote_id
FROM quote_submissions qs
WHERE qs.email IS NOT NULL 
  AND qs.email != ''
  AND NOT EXISTS (
      SELECT 1 FROM customers c 
      WHERE c.email = qs.email
  )
GROUP BY qs.email
ORDER BY MIN(qs.created_at) ASC;

-- Report: Customers created from quotes
SELECT 
    CONCAT('✓ Created ', COUNT(*), ' customers from quote submissions') as migration_step_3
FROM customers 
WHERE migrated_from_quote_id IS NOT NULL;

-- =====================================================
-- STEP 5: Update customers with additional quote data
-- =====================================================
-- For customers created from quotes, add their vehicle info as notes

UPDATE customers c
INNER JOIN quote_submissions qs ON c.migrated_from_quote_id = qs.id
SET c.notes = CONCAT(
    'Vehículo a vender: ',
    qs.brand, ' ', qs.model, ' ', qs.version, ' (', qs.year, ')\n',
    'Kilometraje: ', qs.km, '\n',
    'Condición: ', qs.vehicle_condition
)
WHERE c.migrated_from_quote_id IS NOT NULL;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verification 1: Count comparison
SELECT 
    'VERIFICATION: Record counts' as check_name,
    (SELECT COUNT(*) FROM leads) as original_leads,
    (SELECT COUNT(*) FROM opportunities WHERE migrated_from_lead_id IS NOT NULL) as migrated_opportunities,
    (SELECT COUNT(*) FROM quote_submissions) as original_quotes,
    (SELECT COUNT(*) FROM customers WHERE migrated_from_quote_id IS NOT NULL) as migrated_quote_customers,
    (SELECT COUNT(*) FROM customers WHERE source = 'partner') as migrated_lead_customers;

-- Verification 2: Check for data integrity
SELECT 
    'VERIFICATION: Opportunities with customers' as check_name,
    COUNT(*) as total_opportunities,
    SUM(CASE WHEN customer_id IS NOT NULL THEN 1 ELSE 0 END) as with_customer,
    SUM(CASE WHEN customer_id IS NULL THEN 1 ELSE 0 END) as without_customer
FROM opportunities
WHERE migrated_from_lead_id IS NOT NULL;

-- Verification 3: Stage distribution
SELECT 
    'VERIFICATION: Opportunity stages' as check_name,
    stage,
    COUNT(*) as count
FROM opportunities
WHERE migrated_from_lead_id IS NOT NULL
GROUP BY stage
ORDER BY count DESC;

-- Verification 4: Customer source distribution
SELECT 
    'VERIFICATION: Customer sources' as check_name,
    source,
    customer_type,
    COUNT(*) as count
FROM customers
GROUP BY source, customer_type
ORDER BY count DESC;

-- Verification 5: Check for orphaned records
SELECT 
    'VERIFICATION: Orphaned opportunities (no customer)' as check_name,
    COUNT(*) as orphaned_count
FROM opportunities o
WHERE o.customer_id NOT IN (SELECT id FROM customers);

-- Verification 6: Sample migrated data
SELECT 
    'VERIFICATION: Sample migrated opportunities' as check_name,
    o.id,
    o.title,
    o.stage,
    c.full_name as customer_name,
    c.whatsapp,
    car.brand,
    car.model,
    o.estimated_value,
    o.created_at
FROM opportunities o
INNER JOIN customers c ON c.id = o.customer_id
LEFT JOIN cars car ON car.id = o.car_id
WHERE o.migrated_from_lead_id IS NOT NULL
LIMIT 10;

-- =====================================================
-- MIGRATION SUMMARY
-- =====================================================
SELECT '========================================' as '';
SELECT 'MIGRATION COMPLETED SUCCESSFULLY' as '';
SELECT '========================================' as '';
SELECT '' as '';
SELECT 'Summary:' as '';
SELECT CONCAT('- Customers from leads: ', COUNT(*)) as '' 
FROM customers WHERE source = 'partner';
SELECT CONCAT('- Customers from quotes: ', COUNT(*)) as '' 
FROM customers WHERE migrated_from_quote_id IS NOT NULL;
SELECT CONCAT('- Opportunities created: ', COUNT(*)) as '' 
FROM opportunities WHERE migrated_from_lead_id IS NOT NULL;
SELECT '' as '';
SELECT 'Next steps:' as '';
SELECT '1. Review verification queries above' as '';
SELECT '2. Test CRM functionality with migrated data' as '';
SELECT '3. If everything is OK, you can optionally rename leads table:' as '';
SELECT '   RENAME TABLE leads TO leads_backup;' as '';
SELECT '' as '';
SELECT '========================================' as '';

-- =====================================================
-- OPTIONAL: Backup old tables
-- =====================================================
-- Uncomment these lines after verifying migration success
-- to preserve original data as backup

-- RENAME TABLE leads TO leads_backup;
-- RENAME TABLE quote_submissions TO quote_submissions_backup;

-- =====================================================
-- END OF MIGRATION SCRIPT
-- =====================================================
