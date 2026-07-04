-- =====================================================================
--  AMBANGAN FAST PRINT  -  Oracle APEX / ORDS REST API setup
--  Run this ONCE in APEX:  SQL Workshop -> SQL Commands  (paste + Run).
--  It exposes your tables as public read-only JSON endpoints so the
--  website can fetch live data. Editing rows later in SQL Workshop then
--  shows up on the site automatically.
--
--  After running, go to  SQL Workshop -> RESTful Services -> afp module,
--  open any handler, and copy its "Full URL". Send me the part up to
--  and including  /afp/  -- e.g.
--      https://apex.oracle.com/pls/apex/afpapi/afp/
--  That's the only thing I need to finish wiring the website.
-- =====================================================================

-- 1) REST-enable this schema and give it a short URL alias ('afpapi').
BEGIN
  ORDS.ENABLE_SCHEMA(
    p_enabled             => TRUE,
    p_schema              => USER,
    p_url_mapping_type    => 'BASE_PATH',
    p_url_mapping_pattern => 'afpapi',   -- appears in the URL
    p_auto_rest_auth      => FALSE);     -- public (read-only endpoints)
  COMMIT;
END;
/

-- 2) Define the 'afp' module and its GET endpoints.
BEGIN
  BEGIN ORDS.DELETE_MODULE(p_module_name => 'afp'); EXCEPTION WHEN OTHERS THEN NULL; END;

  ORDS.DEFINE_MODULE(
    p_module_name   => 'afp',
    p_base_path     => '/afp/',
    p_items_per_page=> 200,
    p_status        => 'PUBLISHED',
    p_comments      => 'Ambangan Fast Print public read API');

  -----------------------------------------------------------------
  -- /afp/orders  -> one row per order, joined + human friendly
  -----------------------------------------------------------------
  ORDS.DEFINE_TEMPLATE(p_module_name => 'afp', p_pattern => 'orders');
  ORDS.DEFINE_HANDLER(
    p_module_name => 'afp',
    p_pattern     => 'orders',
    p_method      => 'GET',
    p_source_type => ORDS.source_type_collection_feed,
    p_source      => q'~
      SELECT o.OrderID                              AS order_id,
             'AFP-' || LPAD(o.OrderID, 4, '0')      AS order_ref,
             TO_CHAR(o.OrderDateTime,
                     'YYYY-MM-DD"T"HH24:MI:SS')      AS order_datetime,
             c.CustomerID                           AS customer_id,
             c.CustomerName                         AS customer_name,
             c.CustomerPhoneNum                     AS customer_phone,
             c.CustomerEmail                        AS customer_email,
             o.OrderStatus                          AS status,
             e.EmployeeName                         AS handled_by,
             r.PaymentMethod                        AS payment_method,
             r.ReceiptDepoAmount                    AS deposit_amount,
             r.ReceiptTotalAmount                   AS total_amount,
             o.Remark                               AS remark,
             (SELECT LISTAGG(s.ServiceType, ', ')
                       WITHIN GROUP (ORDER BY s.ServiceType)
                FROM ORDERSERVICE os
                JOIN SERVICE s ON s.ServiceID = os.ServiceID
               WHERE os.OrderID = o.OrderID)        AS services,
             CASE WHEN d.DeliveryID IS NOT NULL THEN 'Delivery'
                  ELSE 'Self Pick-up' END            AS fulfilment
        FROM ORDERS o
        JOIN CUSTOMER c ON c.CustomerID = o.CustomerID
        LEFT JOIN EMPLOYEE e ON e.EmployeeID = o.EmployeeID
        LEFT JOIN RECEIPT  r ON r.ReceiptID  = o.ReceiptID
        LEFT JOIN DELIVERY d ON d.OrderID    = o.OrderID
       ORDER BY o.OrderDateTime DESC
    ~');

  -----------------------------------------------------------------
  -- /afp/orderitems  -> line items (ORDERSERVICE) with service + machine
  -----------------------------------------------------------------
  ORDS.DEFINE_TEMPLATE(p_module_name => 'afp', p_pattern => 'orderitems');
  ORDS.DEFINE_HANDLER(
    p_module_name => 'afp',
    p_pattern     => 'orderitems',
    p_method      => 'GET',
    p_source_type => ORDS.source_type_collection_feed,
    p_source      => q'~
      SELECT os.OrderID       AS order_id,
             os.ServiceID     AS service_id,
             s.ServiceType    AS service_type,
             os.Quantity      AS quantity,
             os.OSSize        AS size_spec,
             os.Text          AS item_text,
             os.AmountPrice   AS amount_price,
             m.MachineName    AS machine_name
        FROM ORDERSERVICE os
        JOIN SERVICE s ON s.ServiceID = os.ServiceID
        LEFT JOIN MACHINE m ON m.MachineID = os.MachineID
       ORDER BY os.OrderID, os.ServiceID
    ~');

  -----------------------------------------------------------------
  -- /afp/customers
  -----------------------------------------------------------------
  ORDS.DEFINE_TEMPLATE(p_module_name => 'afp', p_pattern => 'customers');
  ORDS.DEFINE_HANDLER(
    p_module_name => 'afp', p_pattern => 'customers', p_method => 'GET',
    p_source_type => ORDS.source_type_collection_feed,
    p_source => q'~
      SELECT CustomerID AS customer_id, CustomerName AS customer_name,
             CustomerPhoneNum AS customer_phone, CustomerEmail AS customer_email
        FROM CUSTOMER ORDER BY CustomerID
    ~');

  -----------------------------------------------------------------
  -- /afp/employees
  -----------------------------------------------------------------
  ORDS.DEFINE_TEMPLATE(p_module_name => 'afp', p_pattern => 'employees');
  ORDS.DEFINE_HANDLER(
    p_module_name => 'afp', p_pattern => 'employees', p_method => 'GET',
    p_source_type => ORDS.source_type_collection_feed,
    p_source => q'~
      SELECT EmployeeID AS employee_id, EmployeeName AS employee_name,
             EmployeePhone AS employee_phone,
             EmployeeJobPosition AS job_position
        FROM EMPLOYEE ORDER BY EmployeeID
    ~');

  -----------------------------------------------------------------
  -- /afp/services  (with subtype category)
  -----------------------------------------------------------------
  ORDS.DEFINE_TEMPLATE(p_module_name => 'afp', p_pattern => 'services');
  ORDS.DEFINE_HANDLER(
    p_module_name => 'afp', p_pattern => 'services', p_method => 'GET',
    p_source_type => ORDS.source_type_collection_feed,
    p_source => q'~
      SELECT s.ServiceID AS service_id, s.ServiceType AS service_type,
             s.ServicePrice AS service_price,
             CASE
               WHEN p.ServiceID  IS NOT NULL THEN 'Print'
               WHEN b.ServiceID  IS NOT NULL THEN 'Business Card'
               WHEN rs.ServiceID IS NOT NULL THEN 'Rubber Stamp'
               WHEN n.ServiceID  IS NOT NULL THEN 'Name Tag'
               WHEN bb.ServiceID IS NOT NULL THEN 'Banner & Bunting'
               ELSE 'Other'
             END AS category
        FROM SERVICE s
        LEFT JOIN PRINT p             ON p.ServiceID  = s.ServiceID
        LEFT JOIN BUSINESSCARD b      ON b.ServiceID  = s.ServiceID
        LEFT JOIN RUBBERSTAMP rs      ON rs.ServiceID = s.ServiceID
        LEFT JOIN NAMETAG n           ON n.ServiceID  = s.ServiceID
        LEFT JOIN BANNERANDBUNTING bb ON bb.ServiceID = s.ServiceID
       ORDER BY s.ServiceID
    ~');

  -----------------------------------------------------------------
  -- /afp/machines
  -----------------------------------------------------------------
  ORDS.DEFINE_TEMPLATE(p_module_name => 'afp', p_pattern => 'machines');
  ORDS.DEFINE_HANDLER(
    p_module_name => 'afp', p_pattern => 'machines', p_method => 'GET',
    p_source_type => ORDS.source_type_collection_feed,
    p_source => q'~
      SELECT MachineID AS machine_id, MachineName AS machine_name,
             MachineType AS machine_type, MachineBrand AS machine_brand,
             MachineStatus AS machine_status
        FROM MACHINE ORDER BY MachineID
    ~');

  -----------------------------------------------------------------
  -- /afp/deliveries
  -----------------------------------------------------------------
  ORDS.DEFINE_TEMPLATE(p_module_name => 'afp', p_pattern => 'deliveries');
  ORDS.DEFINE_HANDLER(
    p_module_name => 'afp', p_pattern => 'deliveries', p_method => 'GET',
    p_source_type => ORDS.source_type_collection_feed,
    p_source => q'~
      SELECT d.DeliveryID AS delivery_id,
             'AFP-' || LPAD(d.OrderID, 4, '0') AS order_ref,
             d.OrderID AS order_id,
             TO_CHAR(d.DeliveryDate, 'YYYY-MM-DD"T"HH24:MI:SS') AS delivery_date,
             d.DeliveryAddress AS address, d.DeliveryRemark AS remark,
             d.TrackingNumber AS tracking_number
        FROM DELIVERY d ORDER BY d.DeliveryID
    ~');

  -----------------------------------------------------------------
  -- /afp/receipts
  -----------------------------------------------------------------
  ORDS.DEFINE_TEMPLATE(p_module_name => 'afp', p_pattern => 'receipts');
  ORDS.DEFINE_HANDLER(
    p_module_name => 'afp', p_pattern => 'receipts', p_method => 'GET',
    p_source_type => ORDS.source_type_collection_feed,
    p_source => q'~
      SELECT r.ReceiptID AS receipt_id, r.OrderID AS order_id,
             TO_CHAR(r.ReceiptDate, 'YYYY-MM-DD"T"HH24:MI:SS') AS receipt_date,
             r.PaymentMethod AS payment_method,
             r.ReceiptDepoAmount AS deposit_amount,
             r.ReceiptTotalAmount AS total_amount,
             e.EmployeeName AS cashier
        FROM RECEIPT r
        LEFT JOIN EMPLOYEE e ON e.EmployeeID = r.EmployeeID
       ORDER BY r.ReceiptID
    ~');

  -- ===================================================================
  --  WRITE ENDPOINTS (two-way sync: website -> Oracle)
  --  JSON body keys become bind variables; OUT binds are returned as
  --  JSON; :status sets the HTTP status code.
  -- ===================================================================

  -- POST /afp/customers  -> insert a new customer (website sign-up)
  ORDS.DEFINE_HANDLER(
    p_module_name => 'afp',
    p_pattern     => 'customers',
    p_method      => 'POST',
    p_source_type => ORDS.source_type_plsql,
    p_source      => q'~
      BEGIN
        INSERT INTO CUSTOMER (CustomerName, CustomerPhoneNum, CustomerEmail)
        VALUES (:name, :phone, :email)
        RETURNING CustomerID INTO :customer_id;
        :status := 201;
      END;
    ~');

  -- POST /afp/orders  -> place a new order (find-or-create the customer first)
  ORDS.DEFINE_HANDLER(
    p_module_name => 'afp',
    p_pattern     => 'orders',
    p_method      => 'POST',
    p_source_type => ORDS.source_type_plsql,
    p_source      => q'~
      DECLARE
        v_cust NUMBER;
      BEGIN
        BEGIN
          SELECT CustomerID INTO v_cust FROM CUSTOMER
           WHERE (:email IS NOT NULL AND CustomerEmail    = :email)
              OR (:phone IS NOT NULL AND CustomerPhoneNum = :phone)
           FETCH FIRST 1 ROWS ONLY;
        EXCEPTION WHEN NO_DATA_FOUND THEN
          INSERT INTO CUSTOMER (CustomerName, CustomerPhoneNum, CustomerEmail)
          VALUES (:name, :phone, :email) RETURNING CustomerID INTO v_cust;
        END;
        INSERT INTO ORDERS (OrderDateTime, EmployeeID, CustomerID, Remark, OrderStatus)
        VALUES (SYSDATE, NVL(:employee_id, 7), v_cust, :remark, 'Pending')
        RETURNING OrderID INTO :order_id;
        :order_ref := 'AFP-' || LPAD(:order_id, 4, '0');
        :status := 201;
      END;
    ~');

  -- PUT /afp/orderstatus  -> update an order's lifecycle status
  ORDS.DEFINE_TEMPLATE(p_module_name => 'afp', p_pattern => 'orderstatus');
  ORDS.DEFINE_HANDLER(
    p_module_name => 'afp',
    p_pattern     => 'orderstatus',
    p_method      => 'PUT',
    p_source_type => ORDS.source_type_plsql,
    p_source      => q'~
      BEGIN
        UPDATE ORDERS SET OrderStatus = :status_val WHERE OrderID = :order_id;
        :status := 200;
      END;
    ~');

  -- PUT /afp/orderpayment  -> record a payment (creates a RECEIPT, links order)
  ORDS.DEFINE_TEMPLATE(p_module_name => 'afp', p_pattern => 'orderpayment');
  ORDS.DEFINE_HANDLER(
    p_module_name => 'afp',
    p_pattern     => 'orderpayment',
    p_method      => 'PUT',
    p_source_type => ORDS.source_type_plsql,
    p_source      => q'~
      DECLARE
        v_rid    NUMBER;
        v_method VARCHAR2(50);
      BEGIN
        v_method := CASE
                      WHEN UPPER(:method) LIKE '%CARD%' THEN 'Card'
                      WHEN UPPER(:method) LIKE '%CASH%' THEN 'Cash'
                      ELSE 'Online'
                    END;
        INSERT INTO RECEIPT (PaymentMethod, EmployeeID, OrderID, ReceiptTotalAmount)
        VALUES (v_method, NVL(:employee_id, 7), :order_id, :total)
        RETURNING ReceiptID INTO v_rid;
        UPDATE ORDERS SET ReceiptID = v_rid WHERE OrderID = :order_id;
        :receipt_id := v_rid;
        :status := 200;
      END;
    ~');

  COMMIT;
END;
/

-- 3) Sanity check: list what we just created.
SELECT p.name AS module, t.uri_template, h.method
  FROM user_ords_modules  p
  JOIN user_ords_templates t ON t.module_id  = p.id
  JOIN user_ords_handlers  h ON h.template_id = t.id
 WHERE p.name = 'afp'
 ORDER BY t.uri_template;

-- =====================================================================
--  IMPORTANT — enable CORS so the website (a different domain) can read
--  AND write. SQL Workshop -> RESTful Services -> Modules -> afp ->
--  (Edit) -> set "Origins Allowed" to:   *      then Apply Changes.
--  ('*' covers GET, POST and PUT. If you prefer, use exactly:
--   https://xanotic.github.io )
--
--  This script is idempotent: it drops and recreates the whole 'afp'
--  module each run, so re-run it any time you change an endpoint.
-- =====================================================================
