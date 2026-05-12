import { Handler } from "@netlify/functions";
import admin from "firebase-admin";

// Initialize Firebase Admin (Only once per execution)
if (admin.apps.length === 0) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || "gen-lang-client-0590188373";
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: projectId,
    });
  } catch (e) {
    console.error("[NETLIFY_AUTH] Admin init failed:", e);
  }
}

const db = admin.apps.length > 0 ? admin.firestore() : null;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = event.isBase64Encoded 
    ? Buffer.from(event.body || "", "base64").toString("utf-8")
    : event.body || "{}";

  let commandKey = "";
  try {
    const data = JSON.parse(body);
    commandKey = data.commandKey || "";
  } catch (e) {
    return { 
      statusCode: 400, 
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ error: "INVALID DATA FORMAT" }) 
    };
  }
  
  // Environment variables are injected by Netlify
  const env = process.env;
  
  // Construct defaults
  const def_pref = "MADECC";
  const def_year = "2026";
  const def = (role: string) => `${role}_${def_pref}_${def_year}`;

  const defaultKeys: Record<string, string> = {
    'CEO': (env.CEO_ACCESS_KEY || def('CEO')).trim(),
    'PROJECT_MANAGER': (env.PM_ACCESS_KEY || def('PM')).trim(),
    'CONTENT_EDITOR': (env.CE_ACCESS_KEY || def('CE')).trim(),
    'FINANCIAL_OFFICER': (env.FO_ACCESS_KEY || def('FO')).trim(),
    'ACCOUNTANT': (env.ACC_ACCESS_KEY || def('ACC')).trim(),
    'SECRETARY': (env.SEC_ACCESS_KEY || def('SEC')).trim()
  };

  let systemKeys = defaultKeys;

  // Try to Load from Firestore
  if (db) {
    try {
      const doc = await db.collection("system").doc("security").get();
      if (doc.exists) {
        systemKeys = (doc.data() as any).keys;
      }
    } catch (e) {
      console.warn("[NETLIFY_AUTH] Firestore fetch failed, using defaults:", e);
    }
  }

  const trimmedInput = commandKey.trim().toUpperCase();
  const roleEntry = Object.entries(systemKeys).find(([_, key]) => key.toUpperCase() === trimmedInput && key.length > 0);

  if (roleEntry) {
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ success: true, role: roleEntry[0] }),
    };
  }

  return {
    statusCode: 401,
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    body: JSON.stringify({ success: false, error: "INVALID COMMAND SEQUENCE" }),
  };
};
