# SEHRM Frontend — Salesforce integration

This frontend scaffold now includes an optional Salesforce API adapter and premium UI tweaks (header gradient, dark mode toggle, analytics chart).

What I added
- src/api/salesforce.ts — lightweight helper to call Salesforce REST API (uses access token set at runtime)
- Analytics chart component using react-chartjs-2
- Premium header with theme toggle
- .env.example with required variables for Salesforce integration
- Updated package.json to include react-chartjs-2 and classnames

Quick steps to connect to Salesforce (browser-based flow)
1. Create a Connected App in Salesforce (Setup → App Manager → New Connected App)
   - Enable OAuth Settings
   - Callback URL: https://your-host.example.com (or http://localhost:5173 for dev)
   - Selected OAuth Scopes: full, api, refresh_token, offline_access
   - Save and copy the Consumer Key (client id)

2. Set environment variables in frontend/.env (based on .env.example)
   - VITE_SF_INSTANCE_URL=https://login.salesforce.com  (or your mydomain instance URL)
   - VITE_SF_CLIENT_ID=<consumer key from connected app>
   - VITE_SF_REDIRECT_URI=<callback url you configured>
   - VITE_SF_API_VERSION=58.0

3. In the browser, call salesforceAuthUrl() exported from src/api/salesforce.ts to get the OAuth URL and redirect the user.
   - The example helper uses the implicit/token flow and expects an access token in the hash fragment. For production consider a server-side OAuth flow to keep client secret safe.

4. Once you have an access token, call setAccessToken(token) from src/api/salesforce.ts (e.g. from login callback) so the frontend can call the REST endpoints.

Notes and next steps
- The SOQL queries assume custom objects Employee__c and Leave_Request__c — update the object and field API names to match your Salesforce org.
- For secure production deployments use a backend proxy to handle OAuth refresh tokens and keep client secrets off the browser.
- I can implement the OAuth redirect handler, token exchange, and a small Express proxy if you want me to add the server-side piece next.
