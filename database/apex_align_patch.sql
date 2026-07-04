-- =====================================================================
--  ALIGNMENT PATCH  -  run this in APEX (SQL Workshop -> SQL Commands)
--  ONLY IF you already loaded the original schema and do NOT want to
--  rebuild. It adds the two columns the website needs and fills them.
--  (If a column already exists you'll get "column being added already
--   exists in table" — harmless, just means it was already applied.)
-- =====================================================================

ALTER TABLE CUSTOMER ADD (CustomerEmail VARCHAR2(120));

ALTER TABLE ORDERS ADD (
    OrderStatus VARCHAR2(20) DEFAULT 'Pending'
        CHECK (OrderStatus IN ('Pending','Ready to Pick Up','Completed','Cancelled'))
);

-- Customer emails
UPDATE CUSTOMER SET CustomerEmail = 'ali.ahmad@gmail.com'      WHERE CustomerID = 1;
UPDATE CUSTOMER SET CustomerEmail = 'siti.aisyah@moe.gov.my'   WHERE CustomerID = 2;
UPDATE CUSTOMER SET CustomerEmail = 'john.tan@gmail.com'       WHERE CustomerID = 3;
UPDATE CUSTOMER SET CustomerEmail = 'raj.kumar@email.com'      WHERE CustomerID = 4;
UPDATE CUSTOMER SET CustomerEmail = 'nur.amalina@moe.gov.my'   WHERE CustomerID = 5;
UPDATE CUSTOMER SET CustomerEmail = 'lim.wei@gmail.com'        WHERE CustomerID = 6;
UPDATE CUSTOMER SET CustomerEmail = 'farah.zain@email.com'     WHERE CustomerID = 7;
UPDATE CUSTOMER SET CustomerEmail = 'aiman.hakim@gmail.com'    WHERE CustomerID = 8;
UPDATE CUSTOMER SET CustomerEmail = 'mei.ling@email.com'       WHERE CustomerID = 9;
UPDATE CUSTOMER SET CustomerEmail = 'david.lee@gmail.com'      WHERE CustomerID = 10;
UPDATE CUSTOMER SET CustomerEmail = 'hafiz.rahman@moe.gov.my'  WHERE CustomerID = 11;

-- Order lifecycle status
UPDATE ORDERS SET OrderStatus = 'Completed'         WHERE OrderID = 1;
UPDATE ORDERS SET OrderStatus = 'Completed'         WHERE OrderID = 2;
UPDATE ORDERS SET OrderStatus = 'Completed'         WHERE OrderID = 3;
UPDATE ORDERS SET OrderStatus = 'Ready to Pick Up'  WHERE OrderID = 4;
UPDATE ORDERS SET OrderStatus = 'Completed'         WHERE OrderID = 5;
UPDATE ORDERS SET OrderStatus = 'Pending'           WHERE OrderID = 6;
UPDATE ORDERS SET OrderStatus = 'Completed'         WHERE OrderID = 7;
UPDATE ORDERS SET OrderStatus = 'Ready to Pick Up'  WHERE OrderID = 8;
UPDATE ORDERS SET OrderStatus = 'Pending'           WHERE OrderID = 9;
UPDATE ORDERS SET OrderStatus = 'Completed'         WHERE OrderID = 10;
UPDATE ORDERS SET OrderStatus = 'Cancelled'         WHERE OrderID = 11;

COMMIT;

SELECT OrderStatus, COUNT(*) FROM ORDERS GROUP BY OrderStatus ORDER BY 1;
