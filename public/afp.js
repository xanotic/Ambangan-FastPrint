/* ═════════════════════════════════════════════════════════════
   AMBANGAN FAST PRINT — E-COMMERCE PROTOTYPE CORE
   Shared front-end "system": order store, mock staff auth, and the
   in-app customer order modal. No backend — data lives in the browser
   (localStorage) so the B2C order flow and the B2E staff dashboard
   share the same records. Prototype scope only.
   ═════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var ORDERS_KEY = "afp_orders";
  var SEQ_KEY = "afp_seq";
  var SESSION_KEY = "afp_staff_session";
  var CUSTOMERS_KEY = "afp_customers";
  var CUST_SESSION_KEY = "afp_customer_session";

  var STATUSES = ["Pending", "Ready to Pick Up", "Completed", "Cancelled"];

  // Mock internal accounts (prototype only — credentials shown on login page).
  // Roles: Owner & Admin get management features (reports, customers); Staff get order ops only.
  var STAFF_USERS = [
    { username: "owner", password: "admin123", name: "Shop Owner", role: "Owner" },
    { username: "admin", password: "admin123", name: "System Admin", role: "Admin" },
    { username: "staff", password: "staff123", name: "Counter Staff", role: "Staff" }
  ];
  var MANAGER_ROLES = ["Owner", "Admin"];

  function read() {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }
    catch (e) { return []; }
  }
  function write(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
  function now() { return new Date().toISOString(); }
  function nextId() {
    var n = parseInt(localStorage.getItem(SEQ_KEY) || "0", 10) + 1;
    localStorage.setItem(SEQ_KEY, String(n));
    return "AFP-" + String(n).padStart(4, "0");
  }

  var AFP = {
    STATUSES: STATUSES,

    createOrder: function (data) {
      data = data || {};
      var orders = read();
      var order = {
        id: nextId(),
        service: data.service || "Print Order",
        specs: data.specs || [],          // array of "Label: value" strings
        total: data.total || "",          // e.g. "RM 437.50"
        fileName: data.fileName || "",
        customer: {
          name: (data.customer && data.customer.name) || "",
          phone: (data.customer && data.customer.phone) || "",
          email: (data.customer && data.customer.email) || ""
        },
        notes: data.notes || "",
        payment: { status: "Unpaid", method: "", paidAt: "" },
        status: "Pending",
        createdAt: now(),
        history: [{ status: "Pending", at: now(), note: "Order submitted online by customer" }]
      };
      orders.unshift(order);
      write(orders);
      return order;
    },

    getOrders: function () { return read(); },
    getOrder: function (id) {
      return read().filter(function (o) { return o.id === id; })[0] || null;
    },

    // Look up by exact Order ID or by phone number (for the customer tracking page)
    find: function (query) {
      var q = (query || "").trim().toLowerCase();
      if (!q) return [];
      var qDigits = q.replace(/\D/g, "");
      return read().filter(function (o) {
        if (o.id.toLowerCase() === q) return true;
        var phone = (o.customer.phone || "").replace(/\D/g, "");
        return phone && qDigits && phone === qDigits;
      });
    },

    setStatus: function (id, status, note) {
      var orders = read(), found = null;
      orders.forEach(function (o) {
        if (o.id === id) {
          o.status = status;
          o.history.push({ status: status, at: now(), note: note || ("Status updated to " + status) });
          found = o;
        }
      });
      if (found) write(orders);
      return found;
    },

    recordPayment: function (id, method) {
      var orders = read(), found = null;
      orders.forEach(function (o) {
        if (o.id === id) {
          o.payment = { status: "Paid", method: method || "Cash", paidAt: now() };
          o.history.push({ status: o.status, at: now(), note: "Payment recorded — " + (method || "Cash") });
          found = o;
        }
      });
      if (found) write(orders);
      return found;
    },

    // ---- Mock staff authentication (session-based) ----
    login: function (username, password) {
      var u = STAFF_USERS.filter(function (x) {
        return x.username === username && x.password === password;
      })[0];
      if (!u) return null;
      var sess = { username: u.username, name: u.name, role: u.role, at: now() };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sess));
      return sess;
    },
    session: function () {
      try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
      catch (e) { return null; }
    },
    logout: function () { sessionStorage.removeItem(SESSION_KEY); },
    isManager: function (role) { return MANAGER_ROLES.indexOf(role) > -1; },

    // ---- Customer accounts (B2C self-service) ----
    getCustomers: function () {
      try { return JSON.parse(localStorage.getItem(CUSTOMERS_KEY)) || []; }
      catch (e) { return []; }
    },
    registerCustomer: function (data) {
      data = data || {};
      var email = (data.email || "").trim().toLowerCase();
      if (!data.name || !email || !data.phone || !data.password) {
        return { error: "Please fill in all fields." };
      }
      var customers = AFP.getCustomers();
      if (customers.some(function (c) { return c.email === email; })) {
        return { error: "An account with this email already exists. Please log in." };
      }
      var customer = {
        id: "C-" + Date.now().toString(36),
        name: data.name.trim(),
        email: email,
        phone: data.phone.trim(),
        password: data.password, // prototype only — never store plaintext in production
        createdAt: now()
      };
      customers.push(customer);
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
      var sess = { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone };
      sessionStorage.setItem(CUST_SESSION_KEY, JSON.stringify(sess));
      return { ok: true, customer: sess };
    },
    loginCustomer: function (email, password) {
      email = (email || "").trim().toLowerCase();
      var c = AFP.getCustomers().filter(function (x) {
        return x.email === email && x.password === password;
      })[0];
      if (!c) return null;
      var sess = { id: c.id, name: c.name, email: c.email, phone: c.phone };
      sessionStorage.setItem(CUST_SESSION_KEY, JSON.stringify(sess));
      return sess;
    },
    customerSession: function () {
      try { return JSON.parse(sessionStorage.getItem(CUST_SESSION_KEY)); }
      catch (e) { return null; }
    },
    logoutCustomer: function () { sessionStorage.removeItem(CUST_SESSION_KEY); },

    // Orders belonging to a customer (matched by email or phone digits)
    ordersForCustomer: function (email, phone) {
      var em = (email || "").trim().toLowerCase();
      var ph = (phone || "").replace(/\D/g, "");
      return read().filter(function (o) {
        var oem = (o.customer.email || "").trim().toLowerCase();
        var oph = (o.customer.phone || "").replace(/\D/g, "");
        return (em && oem === em) || (ph && oph && oph === ph);
      });
    },

    // ---- Shared formatting helpers (used by staff + track pages too) ----
    fmtDate: function (iso) {
      if (!iso) return "";
      var d = new Date(iso);
      return d.toLocaleString("en-MY", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    },
    statusClass: function (status) {
      return "afp-badge afp-badge-" + status.toLowerCase().replace(/[^a-z]+/g, "-");
    }
  };

  window.AFP = AFP;

  /* ───────────────────────────────────────────────────────────
     Shared CSS (badges + customer order modal). Injected once so
     every page that loads afp.js gets consistent styling.
     ─────────────────────────────────────────────────────────── */
  var CSS = [
    ".afp-badge{display:inline-flex;align-items:center;gap:.4rem;font-size:.62rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:.3rem .7rem;border-radius:50px;border:1px solid transparent;white-space:nowrap;}",
    ".afp-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor;}",
    ".afp-badge-pending{color:#f5b945;background:rgba(245,185,69,.1);border-color:rgba(245,185,69,.25);}",
    ".afp-badge-ready-to-pick-up{color:#29b6d8;background:rgba(41,182,216,.1);border-color:rgba(41,182,216,.25);}",
    ".afp-badge-completed{color:#34d399;background:rgba(52,211,153,.1);border-color:rgba(52,211,153,.25);}",
    ".afp-badge-cancelled{color:#f87171;background:rgba(248,113,113,.1);border-color:rgba(248,113,113,.25);}",
    ".afp-pay-paid{color:#34d399;}.afp-pay-unpaid{color:#f5b945;}",

    /* modal */
    ".afp-modal-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding:5vh 1.2rem;background:rgba(3,5,9,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;transition:opacity .25s;overflow-y:auto;}",
    ".afp-modal-overlay.show{opacity:1;}",
    ".afp-modal{width:100%;max-width:520px;background:#0b0f1a;border:1px solid rgba(255,255,255,.1);border-radius:24px;box-shadow:0 30px 80px rgba(0,0,0,.6);transform:translateY(16px);transition:transform .3s cubic-bezier(.25,.1,.25,1);overflow:hidden;}",
    ".afp-modal-overlay.show .afp-modal{transform:translateY(0);}",
    ".afp-modal-head{padding:1.6rem 1.8rem 1.2rem;border-bottom:1px solid rgba(255,255,255,.06);position:relative;}",
    ".afp-modal-eyebrow{font-size:.6rem;font-weight:800;letter-spacing:.28em;text-transform:uppercase;color:#29b6d8;}",
    ".afp-modal-title{font-family:'Playfair Display',Georgia,serif;font-size:1.55rem;font-weight:800;color:#fff;margin-top:.35rem;line-height:1.1;}",
    ".afp-modal-x{position:absolute;top:1.3rem;right:1.3rem;width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:rgba(255,255,255,.6);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.2s;}",
    ".afp-modal-x:hover{color:#fff;background:rgba(255,255,255,.1);}",
    ".afp-modal-body{padding:1.5rem 1.8rem 1.9rem;}",
    ".afp-summary{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:1.1rem 1.25rem;margin-bottom:1.4rem;}",
    ".afp-summary-row{display:flex;justify-content:space-between;gap:1rem;font-size:.78rem;padding:.28rem 0;color:rgba(255,255,255,.7);}",
    ".afp-summary-row span:first-child{color:rgba(255,255,255,.45);font-weight:500;}",
    ".afp-summary-row span:last-child{color:#fff;font-weight:600;text-align:right;}",
    ".afp-summary-total{margin-top:.7rem;padding-top:.8rem;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center;}",
    ".afp-summary-total .lbl{font-size:.62rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.5);}",
    ".afp-summary-total .val{font-family:'Playfair Display',Georgia,serif;font-size:1.5rem;font-weight:800;color:#29b6d8;}",
    ".afp-field{margin-bottom:1rem;}",
    ".afp-field label{display:block;font-size:.62rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#7fd4e8;margin-bottom:.45rem;}",
    ".afp-field input,.afp-field textarea{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:.8rem 1rem;color:#fff;font-size:.85rem;font-family:inherit;outline:none;transition:.2s;}",
    ".afp-field input:focus,.afp-field textarea:focus{border-color:rgba(41,182,216,.5);background:rgba(41,182,216,.04);}",
    ".afp-field input::placeholder,.afp-field textarea::placeholder{color:rgba(255,255,255,.25);}",
    ".afp-row2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}",
    "@media(max-width:480px){.afp-row2{grid-template-columns:1fr;}}",
    ".afp-err{color:#f87171;font-size:.72rem;font-weight:600;margin-bottom:.8rem;display:none;}",
    ".afp-file-note{font-size:.72rem;color:#34d399;font-weight:600;margin-bottom:1rem;display:flex;align-items:center;gap:.4rem;}",
    ".afp-btn{width:100%;display:inline-flex;align-items:center;justify-content:center;gap:.6rem;background:#29b6d8;color:#000;font-size:.8rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:1.05rem;border-radius:50px;border:none;cursor:pointer;transition:.2s;box-shadow:0 4px 20px rgba(41,182,216,.25);}",
    ".afp-btn:hover{background:#4ec8e4;transform:translateY(-1px);}",
    ".afp-btn-ghost{background:transparent;color:rgba(255,255,255,.6);box-shadow:none;border:1px solid rgba(255,255,255,.12);margin-top:.7rem;}",
    ".afp-btn-ghost:hover{background:rgba(255,255,255,.05);color:#fff;transform:none;}",
    ".afp-wa-link{display:block;text-align:center;margin-top:1rem;font-size:.74rem;color:rgba(255,255,255,.4);text-decoration:none;}",
    ".afp-wa-link a,.afp-wa-link span{color:#7fd4e8;text-decoration:underline;cursor:pointer;}",
    /* success */
    ".afp-success{text-align:center;padding:1rem 0 .5rem;}",
    ".afp-success-icon{width:64px;height:64px;border-radius:50%;background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.3);color:#34d399;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 1.1rem;}",
    ".afp-success h3{font-family:'Playfair Display',Georgia,serif;font-size:1.5rem;color:#fff;margin-bottom:.5rem;}",
    ".afp-success p{font-size:.82rem;color:rgba(255,255,255,.6);line-height:1.6;margin-bottom:1.3rem;}",
    ".afp-orderid{display:inline-block;font-family:monospace;font-size:1.15rem;font-weight:800;letter-spacing:.1em;color:#29b6d8;background:rgba(41,182,216,.1);border:1px dashed rgba(41,182,216,.4);border-radius:10px;padding:.5rem 1.1rem;margin:.2rem 0 1.3rem;}",
    /* footer portal links injected on service pages */
    ".afp-portal{display:flex;gap:1.4rem;justify-content:center;margin-top:1rem;flex-wrap:wrap;}",
    ".afp-portal a{font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#7fd4e8;text-decoration:none;display:inline-flex;align-items:center;gap:.4rem;}",
    ".afp-portal a:hover{color:#29b6d8;}"
  ].join("\n");

  function injectCSS() {
    if (document.getElementById("afp-style")) return;
    var s = document.createElement("style");
    s.id = "afp-style";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  injectCSS();

  /* ───────────────────────────────────────────────────────────
     Customer order modal — activates only on service pages that
     have the configurator CTA (#whatsapp-cta).
     ─────────────────────────────────────────────────────────── */
  function esc(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // Pull the human-readable spec lines + total out of the WhatsApp href
  // the page already builds (keeps us in sync with the live configurator).
  function parseFromHref(href) {
    var out = { specs: [], total: "", fileName: "" };
    try {
      var u = new URL(href);
      // URLSearchParams already decodes the value once — no second decode.
      var text = u.searchParams.get("text") || "";
      text.split("\n").forEach(function (line) {
        line = line.trim();
        if (line.indexOf("- ") !== 0) return;
        var body = line.slice(2);
        if (/^estimated price/i.test(body)) {
          out.total = body.replace(/^estimated price:?\s*/i, "");
        } else if (/^attached file/i.test(body)) {
          var fn = body.replace(/^attached file:?\s*/i, "");
          if (fn && !/^(none|no file)/i.test(fn)) out.fileName = fn;
          out.specs.push(body);
        } else {
          out.specs.push(body);
        }
      });
    } catch (e) {}
    return out;
  }

  function currentFileName() {
    var inp = document.querySelector(".upload-input");
    if (inp && inp.files && inp.files.length) {
      var f = inp.files[0];
      return f.name + " (" + (f.size / 1024).toFixed(1) + " KB)";
    }
    return "";
  }

  function serviceName() {
    var active = document.querySelector(".sub-nav-item.active");
    if (active) return active.textContent.trim();
    return (document.title.split("|")[0] || "Print Order").trim();
  }

  /* Universal production/delivery customizations injected into every service
     configurator. Grounded in Ambangan's real workflow (ready-design vs.
     design-for-you, turnaround, pickup vs. delivery). Captured into the order. */
  var addonsState = {
    Design: "I have my design ready",
    Turnaround: "Standard",
    Collection: "Self pick-up at store"
  };
  function getAddons() {
    return [
      "Design: " + addonsState.Design,
      "Turnaround: " + addonsState.Turnaround,
      "Collection: " + addonsState.Collection
    ];
  }
  function injectAddons() {
    var panel = document.querySelector(".settings-panel");
    if (!panel || document.querySelector("[data-afp-addons]")) return;
    var pricing = document.querySelector(".pricing-wrap");
    var pricingSection = pricing ? pricing.closest("section") : null;

    var groups = [
      { key: "Design", title: "Artwork / Design", options: [
        { val: "I have my design ready", desc: "Upload your artwork — we print exactly as supplied.", meta: "No extra charge" },
        { val: "Please design it for me", desc: "Our in-house designer will contact you to create it.", meta: "Design fee on quote" }
      ]},
      { key: "Turnaround", title: "Turnaround Time", options: [
        { val: "Standard", desc: "Normal production schedule for this product.", meta: "Base timeline" },
        { val: "Express / Urgent", desc: "Priority queue — subject to daily capacity.", meta: "Rush fee on quote" }
      ]},
      { key: "Collection", title: "Collection Method", options: [
        { val: "Self pick-up at store", desc: "Collect at our Bedong, Kedah outlet.", meta: "Free" },
        { val: "Delivery / Courier", desc: "Shipped to your address nationwide.", meta: "Charged by location" }
      ]}
    ];

    var html = '<section data-afp-addons>' +
      '<h3 class="settings-section-title"><span>+</span> Production &amp; Delivery</h3>';
    groups.forEach(function (g) {
      html += '<div style="margin-bottom:1.1rem;">' +
        '<div style="font-size:0.6rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:0.65rem;">' + g.title + "</div>" +
        '<div class="options-grid">';
      g.options.forEach(function (o, i) {
        html += '<div class="option-card glass' + (i === 0 ? " active" : "") + '" data-afp-group="' + g.key + '" data-afp-val="' + o.val + '">' +
          '<div class="option-card-header"><span class="option-card-title">' + o.val + '</span><span class="option-card-indicator"></span></div>' +
          '<span class="option-card-desc">' + o.desc + "</span>" +
          '<span class="option-card-meta">' + o.meta + "</span></div>";
      });
      html += "</div></div>";
    });
    html += "</section>";

    var wrap = document.createElement("div");
    wrap.innerHTML = html;
    var node = wrap.firstChild;
    if (pricingSection) panel.insertBefore(node, pricingSection);
    else panel.appendChild(node);

    node.querySelectorAll("[data-afp-group]").forEach(function (card) {
      card.addEventListener("click", function () {
        var grp = card.getAttribute("data-afp-group");
        node.querySelectorAll('[data-afp-group="' + grp + '"]').forEach(function (c) { c.classList.remove("active"); });
        card.classList.add("active");
        addonsState[grp] = card.getAttribute("data-afp-val");
      });
    });
  }

  // Ensure EVERY service lets the customer upload their own artwork. Pages that
  // already ship an upload box keep theirs; the rest get this injected one.
  function injectUpload() {
    var panel = document.querySelector(".settings-panel");
    if (!panel || panel.querySelector(".upload-wrap")) return;
    var html = '<section data-afp-upload>' +
      '<h3 class="settings-section-title"><span>+</span> Upload Your Design</h3>' +
      '<div class="upload-wrap glass">' +
        '<div class="upload-icon">📁</div>' +
        '<div class="upload-title">Drag &amp; drop your design here</div>' +
        '<div class="upload-desc">Optional — supports JPG, PNG, PDF or AI formats (Max 50MB)</div>' +
        '<div class="upload-file-details"></div>' +
        '<input type="file" class="upload-input" accept="image/*,application/pdf,.ai" />' +
      "</div></section>";
    var wrap = document.createElement("div");
    wrap.innerHTML = html;
    var node = wrap.firstChild;
    panel.insertBefore(node, panel.firstChild);

    var box = node.querySelector(".upload-wrap");
    var input = node.querySelector(".upload-input");
    var details = node.querySelector(".upload-file-details");
    var title = node.querySelector(".upload-title");
    var desc = node.querySelector(".upload-desc");
    input.addEventListener("change", function () {
      if (input.files && input.files.length) {
        var f = input.files[0];
        details.innerHTML = "📄 " + f.name + " (" + (f.size / 1024).toFixed(1) + " KB)";
        details.style.display = "inline-flex";
        title.textContent = "Design Selected";
        desc.textContent = "Click again to change the file";
      }
    });
    ["dragenter", "dragover"].forEach(function (ev) {
      box.addEventListener(ev, function (e) { e.preventDefault(); box.classList.add("dragover"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      box.addEventListener(ev, function (e) { e.preventDefault(); box.classList.remove("dragover"); });
    });
  }

  var overlay = null;
  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove("show");
    var el = overlay;
    setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, 250);
    overlay = null;
  }

  function openOrderModal(ctx) {
    var parsed = parseFromHref(ctx.href);
    var specs = parsed.specs.concat(getAddons());
    var total = ctx.total || parsed.total || "";
    var fileName = currentFileName() || parsed.fileName || "";

    overlay = document.createElement("div");
    overlay.className = "afp-modal-overlay";

    var specRows = specs.map(function (s) {
      var idx = s.indexOf(":");
      var label = idx > -1 ? s.slice(0, idx) : s;
      var val = idx > -1 ? s.slice(idx + 1).trim() : "";
      return '<div class="afp-summary-row"><span>' + esc(label) + "</span><span>" + esc(val) + "</span></div>";
    }).join("");

    overlay.innerHTML =
      '<div class="afp-modal" role="dialog" aria-modal="true">' +
        '<div class="afp-modal-head">' +
          '<div class="afp-modal-eyebrow">Online Order</div>' +
          '<div class="afp-modal-title">Place Your ' + esc(ctx.service) + " Order</div>" +
          '<button class="afp-modal-x" data-afp-close aria-label="Close">&times;</button>' +
        "</div>" +
        '<div class="afp-modal-body" data-afp-step="form">' +
          '<div class="afp-summary">' + specRows +
            '<div class="afp-summary-total"><span class="lbl">Estimated Total</span><span class="val">' + esc(total || "—") + "</span></div>" +
          "</div>" +
          (fileName ? '<div class="afp-file-note">📎 Design file attached: ' + esc(fileName) + "</div>" : "") +
          '<div class="afp-err" data-afp-err></div>' +
          '<div class="afp-row2">' +
            '<div class="afp-field"><label>Full Name *</label><input data-afp="name" type="text" placeholder="e.g. Nabil Fauzi" autocomplete="name"></div>' +
            '<div class="afp-field"><label>Phone Number *</label><input data-afp="phone" type="tel" placeholder="e.g. 012-3456789" autocomplete="tel"></div>' +
          "</div>" +
          '<div class="afp-field"><label>Email (optional)</label><input data-afp="email" type="email" placeholder="e.g. nabil@email.com" autocomplete="email"></div>' +
          '<div class="afp-field"><label>Notes for staff (optional)</label><textarea data-afp="notes" rows="2" placeholder="Any special instructions, pickup time, etc."></textarea></div>' +
          '<button class="afp-btn" data-afp-submit>Confirm &amp; Submit Order</button>' +
          '<div class="afp-wa-link">Prefer to order the old way? <a data-afp-wa>Send via WhatsApp instead</a></div>' +
        "</div>" +
      "</div>";

    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add("show"); });

    var nameI = overlay.querySelector('[data-afp="name"]');
    setTimeout(function () { try { nameI.focus(); } catch (e) {} }, 280);

    // Prefill details for a signed-in customer
    var cust = AFP.customerSession();
    if (cust) {
      overlay.querySelector('[data-afp="name"]').value = cust.name || "";
      overlay.querySelector('[data-afp="phone"]').value = cust.phone || "";
      overlay.querySelector('[data-afp="email"]').value = cust.email || "";
    }

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.hasAttribute("data-afp-close")) closeModal();
      if (e.target.hasAttribute("data-afp-wa")) {
        window.open(ctx.href, "_blank");
      }
      if (e.target.hasAttribute("data-afp-submit")) submit();
    });

    function val(k) { var el = overlay.querySelector('[data-afp="' + k + '"]'); return el ? el.value.trim() : ""; }

    function submit() {
      var name = val("name"), phone = val("phone");
      var err = overlay.querySelector("[data-afp-err]");
      if (!name || !phone) {
        err.textContent = "Please enter your name and phone number so we can process your order.";
        err.style.display = "block";
        return;
      }
      var order = AFP.createOrder({
        service: ctx.service,
        specs: specs,
        total: total,
        fileName: fileName,
        customer: { name: name, phone: phone, email: val("email") },
        notes: val("notes")
      });
      showSuccess(order);
    }

    function showSuccess(order) {
      var body = overlay.querySelector(".afp-modal-body");
      body.setAttribute("data-afp-step", "done");
      body.innerHTML =
        '<div class="afp-success">' +
          '<div class="afp-success-icon">✓</div>' +
          "<h3>Order Submitted!</h3>" +
          "<p>Thank you, " + esc(order.customer.name) + ". Your order is now in the queue and our staff have been notified. Save your Order ID to track its progress.</p>" +
          '<div class="afp-orderid">' + esc(order.id) + "</div>" +
          '<a class="afp-btn" href="/track.html?id=' + encodeURIComponent(order.id) + '">Track My Order</a>' +
          '<button class="afp-btn afp-btn-ghost" data-afp-close>Close</button>' +
        "</div>";
    }
  }

  function initServicePage() {
    var cta = document.getElementById("whatsapp-cta");
    if (!cta) return;

    // Intercept the CTA in the capture phase so it fires BEFORE the page's
    // own WhatsApp handler, then stop the event from reaching it.
    document.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("#whatsapp-cta") : null;
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      openOrderModal({
        service: serviceName(),
        href: btn.getAttribute("href") || "",
        total: (document.getElementById("price-total-text") || {}).textContent || ""
      });
    }, true);

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });

    // Ensure a design upload exists on every service, then add production/delivery options
    injectUpload();
    injectAddons();

    // Inject "Track Order / Staff Portal" links into the footer
    var footer = document.querySelector("footer");
    if (footer && !footer.querySelector(".afp-portal")) {
      var portal = document.createElement("div");
      portal.className = "afp-portal";
      portal.innerHTML =
        '<a href="/customer.html">👤 My Account</a>' +
        '<a href="/track.html">📦 Track Your Order</a>' +
        '<a href="/staff.html">🔒 Staff Portal</a>';
      footer.appendChild(portal);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initServicePage);
  } else {
    initServicePage();
  }
})();
