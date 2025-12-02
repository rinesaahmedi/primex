const { ClientSecretCredential } = require("@azure/identity");
const { Client } = require("@microsoft/microsoft-graph-client");
const { TokenCredentialAuthenticationProvider } = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
require("isomorphic-fetch");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// ⚠️ Configuration
const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const TARGET_CALENDAR_EMAIL = "info@primexeu.com"; 

if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
    console.error("❌ MISSING AZURE CREDENTIALS IN .ENV");
    process.exit(1);
}

// 1. Setup the Credential (The "Robot" User)
const credential = new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET);

// 2. Setup the Auth Provider
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    // Application permissions always use .default
    scopes: ["https://graph.microsoft.com/.default"],
});

// 3. Initialize Graph Client
const client = Client.initWithMiddleware({
    debugLogging: false,
    authProvider,
});

/**
 * Returns the authenticated Graph Client.
 * Since we are using App Permissions, we don't need to wait for a user login.
 * We just return the initialized client.
 */
async function getGraphClient() {
    return client;
}

console.log("✅ Outlook System Initialized (Background Mode)");

module.exports = { getGraphClient, TARGET_CALENDAR_EMAIL };