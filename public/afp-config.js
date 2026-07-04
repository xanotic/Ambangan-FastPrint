/* ─────────────────────────────────────────────────────────────
   AMBANGAN FAST PRINT — live data source config
   Paste your Oracle APEX / ORDS base URL below (must end with /afp/).
   Leave it as "" to keep using the offline localStorage demo data.
   Example:  https://apex.oracle.com/pls/apex/afpapi/afp/
   ───────────────────────────────────────────────────────────── */
window.AFP_CONFIG = {
  // The base URL of the ORDS 'afp' module (from apex_ords_setup.sql).
  apiBase: "https://oracleapex.com/ords/2026121939/afp/",
  // When true, live Oracle data is used if apiBase is set and reachable;
  // otherwise the site falls back to the built-in demo data automatically.
  preferLive: true
};
