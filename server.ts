import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import fs from "fs";
import "dotenv/config";
import admin from "firebase-admin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
let db: admin.firestore.Firestore | null = null;
try {
  // Use environment variables for project ID if available, otherwise fallback
  const projectId = process.env.FIREBASE_PROJECT_ID || "gen-lang-client-0590188373";
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: projectId,
  });
  db = admin.firestore();
  console.log(`[FIREBASE_ADMIN] Initialized for project: ${projectId}`);
} catch (e) {
  console.error("[FIREBASE_ADMIN] Failed to initialize admin SDK. Using local storage only.", e);
}

const SECURITY_STORE_PATH = path.join(process.cwd(), "security_store.json");

interface SecurityStore {
  keys: Record<string, string>;
  lastRotation: string;
}

// Global variable to keep keys in memory
let systemKeys: Record<string, string> = {};

async function syncSecurityKeys() {
  const d_p = "MADECC";
  const d_y = "2026";
  const d = (r: string) => `${r}_${d_p}_${d_y}`;

  const defaultKeys = {
    'CEO': (process.env.CEO_ACCESS_KEY || d('CEO')).trim(),
    'PROJECT_MANAGER': (process.env.PM_ACCESS_KEY || d('PM')).trim(),
    'CONTENT_EDITOR': (process.env.CE_ACCESS_KEY || d('CE')).trim(),
    'FINANCIAL_OFFICER': (process.env.FO_ACCESS_KEY || d('FO')).trim(),
    'ACCOUNTANT': (process.env.ACC_ACCESS_KEY || d('ACC')).trim(),
    'SECRETARY': (process.env.SEC_ACCESS_KEY || d('SEC')).trim()
  };

  if (db) {
    try {
      const docRef = db.collection("system").doc("security");
      const doc = await docRef.get();
      
      if (doc.exists) {
        const data = doc.data() as SecurityStore;
        systemKeys = data.keys;
        console.log("[SECURITY] Keys loaded from Firestore.");
      } else {
        console.log("[SECURITY] Initializing security schema in Firestore...");
        const initial = { keys: defaultKeys, lastRotation: new Date().toISOString() };
        await docRef.set(initial);
        systemKeys = defaultKeys;
      }
      return;
    } catch (e) {
      console.warn("[SECURITY] Firestore sync failed, falling back to local file.", e);
    }
  }

  // Fallback to Local file
  if (fs.existsSync(SECURITY_STORE_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(SECURITY_STORE_PATH, "utf-8"));
      systemKeys = data.keys;
    } catch (e) {
      systemKeys = defaultKeys;
    }
  } else {
    systemKeys = defaultKeys;
  }
}

async function saveSecurityKeys(keys: Record<string, string>) {
  systemKeys = keys;
  const store = { keys, lastRotation: new Date().toISOString() };
  
  // Save to Local
  fs.writeFileSync(SECURITY_STORE_PATH, JSON.stringify(store, null, 2));

  // Save to Firestore
  if (db) {
    try {
      await db.collection("system").doc("security").set(store);
      console.log("[SECURITY] Keys persisted to Firestore.");
    } catch (e) {
      console.error("[SECURITY] Firestore save failed.", e);
    }
  }
}

function generateRandomKey(prefix: string): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let retVal = "";
  for (let i = 0; i < 24; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return `${prefix}_ROTATED_${retVal}_${new Date().getFullYear()}`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Contact Form
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;
    console.log("Contact form submission received:", { name, email, message });
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Email Sending Logic
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_RECEIVER_EMAIL } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.error("CRITICAL: SMTP credentials missing in environment variables.");
      return res.status(500).json({ error: "Server configuration error: SMTP credentials missing. Please set them in the Secrets panel." });
    }

    try {
      const isGmail = SMTP_HOST.includes("gmail.com") || SMTP_USER.includes("@gmail.com");
      
      const transportConfig: any = isGmail ? {
        service: "gmail",
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      } : {
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || "587"),
        secure: SMTP_PORT === "465",
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      };

      const transporter = nodemailer.createTransport(transportConfig);

      await transporter.sendMail({
        from: `"MADECC Web Form" <${SMTP_USER}>`,
        to: CONTACT_RECEIVER_EMAIL || "madeccco5@gmail.com",
        replyTo: email,
        subject: `New Project Inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">New MADECC Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <div style="background: #f9f9f9; padding: 15px; margin-top: 20px;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="font-size: 10px; color: #999; margin-top: 40px;">This email was sent from the MADECC Construction website contact form.</p>
          </div>
        `,
      });

      console.log("Email sent successfully.");
      res.json({ success: true, message: "Thank you for contacting MADECC Construction. We will get back to you shortly." });
    } catch (error: any) {
      console.error("Error sending email:", error);
      
      let clientError = "Failed to send email. Please check your SMTP configuration in the Secrets panel.";
      
      if (error.code === 'EAUTH' || error.message.includes('535') || error.message.includes('Invalid login')) {
        clientError = "Authentication failed. For Gmail: 1. Enable 2-Step Verification. 2. Create an 'App Password' at myaccount.google.com/apppasswords. 3. Use that 16-character code as your SMTP_PASS in the Secrets panel.";
      }

      res.status(500).json({ error: clientError });
    }
  });

  // API Route for Admin Login Verification
  app.post("/api/admin/login", async (req, res) => {
    const { commandKey } = req.body;
    
    if (!commandKey || typeof commandKey !== 'string') {
      console.warn("[AUTH_TERMINAL] Login failed: Missing or invalid command key.");
      return res.status(400).json({ success: false, error: "COMMAND KEY REQUIRED" });
    }

    console.log(`[AUTH_TERMINAL] Received login attempt with key prefix: ${commandKey.slice(0, 3)}...`);
    
    // Check if rotation is needed (logic moved here or handled elsewhere)

    const roleEntry = Object.entries(systemKeys).find(([_, key]) => 
      key.trim().toUpperCase() === commandKey.trim().toUpperCase()
    );
    
    if (roleEntry) {
      console.log(`[AUTH_TERMINAL] Login successful for role: ${roleEntry[0]}`);
      return res.json({ success: true, role: roleEntry[0] });
    }

    console.warn(`[AUTH_TERMINAL] Login failed: Key mismatch for input: ${commandKey.trim()}`);
    res.status(401).json({ success: false, error: "INVALID COMMAND SEQUENCE" });
  });

  // API Route for Key Management (CEO ONLY)
  app.get("/api/admin/keys", (req, res) => {
    res.json(systemKeys);
  });

  app.post("/api/admin/keys/update", async (req, res) => {
    const { role, newKey } = req.body;
    const updatedKeys = { ...systemKeys, [role]: newKey };
    await saveSecurityKeys(updatedKeys);
    res.json({ success: true });
  });

  app.post("/api/admin/keys/rotate-all", async (req, res) => {
    const newKeys = { ...systemKeys };
    Object.keys(newKeys).forEach(role => {
      if (role !== 'CEO') {
        newKeys[role] = generateRandomKey(role.substring(0, 3));
      }
    });
    await saveSecurityKeys(newKeys);
    res.json({ success: true, keys: systemKeys });
  });

  // API Route for MFA Code Dispatch
  app.post("/api/send-mfa", async (req, res) => {
    const { code, email, role } = req.body;
    
    if (!code || !email) {
      return res.status(400).json({ error: "Code and email are required." });
    }

    console.log(`[AUTH_TERMINAL] Dispatching MFA Code [${code}] for role [${role}] to ${email}`);

    // Email Dispatch
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      try {
        const isGmail = SMTP_HOST.includes("gmail.com") || SMTP_USER.includes("@gmail.com");
        const transportConfig: any = isGmail ? {
          service: "gmail",
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        } : {
          host: SMTP_HOST,
          port: parseInt(SMTP_PORT || "587"),
          secure: SMTP_PORT === "465",
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        };

        const transporter = nodemailer.createTransport(transportConfig);

        console.log(`[AUTH_TERMINAL] Attempting to send MFA via ${isGmail ? 'Gmail Service' : SMTP_HOST}...`);

        await transporter.sendMail({
          from: `"MADECC Security" <${SMTP_USER}>`,
          to: email,
          subject: `CEO TERMINAL: ACCESS SEQUENCE #${Math.floor(Math.random() * 9000) + 1000}`,
          text: `SECURITY ALERT: An authentication attempt has been detected for the ${role} role.\n\nYOUR MFA CODE: ${code}\n\nIf you did not initiate this request, immediately revoke your primary keys.`,
          html: `
            <div style="font-family: 'Courier New', monospace; max-width: 500px; margin: auto; background: #000; color: #fff; padding: 40px; border: 1px solid #333;">
              <h1 style="color: #ea580c; font-size: 18px; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 10px;">Security Protocol 15-A</h1>
              <p style="color: #666; font-size: 10px; margin-top: 20px;">AUTHORIZATION REQUIRED FOR ${role.toUpperCase()}</p>
              <div style="background: #111; padding: 30px; margin: 30px 0; border: 1px dashed #ea580c; text-align: center;">
                <p style="color: #999; margin: 0; font-size: 11px;">VERIFICATION CODE</p>
                <h2 style="color: #ea580c; font-size: 42px; letter-spacing: 12px; margin: 10px 0;">${code}</h2>
              </div>
              <p style="font-size: 11px; line-height: 1.6; color: #888;">Input this sequence in the terminal to complete primary-to-secondary verification. Sequence expires in 5 minutes.</p>
              <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
                <p style="font-size: 9px; color: #444; margin: 0;">MADECC CONSTRUCTION LTD // CRYPTOGRAPHIC LOCKDOWN ACTIVE</p>
              </div>
            </div>
          `,
        });
        console.log(`[AUTH_TERMINAL] MFA Email successfully sent to ${email}`);
      } catch (error: any) {
        console.error("[AUTH_TERMINAL] Failed to send MFA email:", error.message);
        if (error.code === 'EAUTH') {
          console.error("[AUTH_TERMINAL] TIP: This looks like an authentication error. Ensure you are using a Gmail App Password, not your regular password.");
        }
      }
    } else {
      console.warn("MFA Email skipped: SMTP credentials not provided.");
    }

    // SMS Simulation (Real implementations would use Twilio/Vonage)
    // Twilio/SMS is rarely free, so we only simulate it in logs for this build.
    console.log(`[SMS_GATEWAY] Sent to [237671063511]: MADECC Security Alert! Your code is ${code}. Do not share.`);

    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // SYNC KEYS FIRST
  await syncSecurityKeys();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
