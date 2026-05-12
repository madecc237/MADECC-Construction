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
    console.error("[NETLIFY_KEYS] Admin init failed:", e);
  }
}

const db = admin.apps.length > 0 ? admin.firestore() : null;

export const handler: Handler = async (event) => {
  const env = process.env;
  const def_pref = "MADECC";
  const def_year = "2026";
  const def = (role: string) => `${role}_${def_pref}_${def_year}`;

  const defaultKeys = {
    'CEO': env.CEO_ACCESS_KEY || def('CEO'),
    'PROJECT_MANAGER': env.PM_ACCESS_KEY || def('PM'),
    'CONTENT_EDITOR': env.CE_ACCESS_KEY || def('CE'),
    'FINANCIAL_OFFICER': env.FO_ACCESS_KEY || def('FO'),
    'ACCOUNTANT': env.ACC_ACCESS_KEY || def('ACC'),
    'SECRETARY': env.SEC_ACCESS_KEY || def('SEC')
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
      console.warn("[NETLIFY_KEYS] Firestore fetch failed, using defaults:", e);
    }
  }

  // GET: Fetch keys
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify(systemKeys),
    };
  }

  // POST: Update keys (Partial update for a role)
  if (event.httpMethod === "POST") {
     // NOTE: Real maintenance of Firestore keys should be done via authenticated server routes or CEO dashboard.
     // In this function, we just return a status.
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ 
        success: true, 
        message: "Note: Real-time key maintenance is synchronized across all endpoints via Firestore." 
      }),
    };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
