-- =====================================================================
--  CRUD + LOGIN PATCH  -  run in APEX (SQL Workshop -> SQL Scripts)
--  Adds password/login columns so customers AND staff can log in against
--  Oracle and edit their own profiles. Run this BEFORE re-running
--  apex_ords_setup.sql (which adds the matching endpoints).
--  (Re-running is safe; "column already exists" just means it's applied.)
-- =====================================================================

ALTER TABLE CUSTOMER ADD (CustomerPassword VARCHAR2(200));

ALTER TABLE EMPLOYEE ADD (
  EmployeeUsername VARCHAR2(50),
  EmployeePassword VARCHAR2(200),
  EmployeeRole     VARCHAR2(20) DEFAULT 'Staff'
);

-- Existing customers get a default password so they can log in / be edited.
UPDATE CUSTOMER SET CustomerPassword = 'demo123' WHERE CustomerPassword IS NULL;

-- Staff logins (mirror the old hard-coded accounts).
UPDATE EMPLOYEE SET EmployeeUsername='owner', EmployeePassword='admin123', EmployeeRole='Owner' WHERE EmployeeID=1;
UPDATE EMPLOYEE SET EmployeeUsername='admin', EmployeePassword='admin123', EmployeeRole='Admin' WHERE EmployeeID=7;
UPDATE EMPLOYEE SET EmployeeUsername='staff', EmployeePassword='staff123', EmployeeRole='Staff' WHERE EmployeeID=2;

-- Everyone else gets a login too (username = lowercase name, password staff123).
UPDATE EMPLOYEE
   SET EmployeeUsername = LOWER(REGEXP_REPLACE(EmployeeName,'[^A-Za-z0-9]','')),
       EmployeePassword = 'staff123',
       EmployeeRole     = 'Staff'
 WHERE EmployeeUsername IS NULL;

COMMIT;

SELECT EmployeeID, EmployeeName, EmployeeUsername, EmployeeRole FROM EMPLOYEE ORDER BY EmployeeID;
