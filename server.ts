import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SECURITY_STORE_PATH = path.join(process.cwd(), "security_store.json");

interface SecurityStore {
  keys: Record<string, string>;
  lastRotation: string;
}

function getSecurityStore(): SecurityStore {
  const d_p = "MADECC";
  const d_y = "2026";
  const d = (r: string) => `${r}_${d_p}_${d_y}`;

  const defaultKeys = {
    CEO: (process.env.CEO_ACCESS_KEY || d("CEO")).trim(),
    PROJECT_MANAGER: (process.env.PM_ACCESS_KEY || d("PM")).trim(),
    CONTENT_EDITOR: (process.env.CE_ACCESS_KEY || d("CE")).trim(),
    FINANCIAL_OFFICER: (process.env.FO_ACCESS_KEY || d("FO")).trim(),
    ACCOUNTANT: (process.env.ACC_ACCESS_KEY || d("ACC")).trim(),
    SECRETARY: (process.env.SEC_ACCESS_KEY || d("SEC")).trim(),
  };

  if (!fs.existsSync(SECURITY_STORE_PATH)) {
    const store = { keys: defaultKeys, lastRotation: new Date().toISOString() };
    fs.writeFileSync(SECURITY_STORE_PATH, JSON.stringify(store, null, 2));
    return store;
  }

  try {
    const data = fs.readFileSync(SECURITY_STORE_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return { keys: defaultKeys, lastRotation: new Date().toISOString() };
  }
}

function saveSecurityStore(store: SecurityStore) {
  fs.writeFileSync(SECURITY_STORE_PATH, JSON.stringify(store, null, 2));
}

function generateRandomKey(prefix: string): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
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

  // CONTACT FORM
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    console.log("Contact form submission received:", { name, email, message });

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      CONTACT_RECEIVER_EMAIL,
    } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return res.status(500).json({
        error:
          "Server configuration error: SMTP credentials missing. Please set them.",
      });
    }

    try {
      const isGmail =
        SMTP_HOST.includes("gmail.com") || SMTP_USER.includes("@gmail.com");

      const transportConfig: any = isGmail
        ? {
            service: "gmail",
            auth: {
              user: SMTP_USER,
              pass: SMTP_PASS,
            },
          }
        : {
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
      });

      res.json({
        success: true,
        message: "Thank you for contacting MADECC Construction.",
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Failed to send email." });
    }
  });

  // ADMIN LOGIN
  app.post("/api/admin/login", (req, res) => {
    const { commandKey } = req.body;
    const store = getSecurityStore();

    const lastRotation = new Date(store.lastRotation);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    if (lastRotation < ninetyDaysAgo) {
      const newKeys = { ...store.keys };

      Object.keys(newKeys).forEach((role) => {
        if (role !== "CEO") {
          newKeys[role] = generateRandomKey(role.substring(0, 3));
        }
      });

      store.keys = newKeys;
      store.lastRotation = new Date().toISOString();

      saveSecurityStore(store);
    }

    const roleEntry = Object.entries(store.keys).find(
      ([_, key]) => key === commandKey
    );

    if (roleEntry) {
      return res.json({
        success: true,
        role: roleEntry[0],
      });
    }

    res.status(401).json({
      success: false,
      error: "INVALID COMMAND SEQUENCE",
    });
  });

  // GET KEYS
  app.get("/api/admin/keys", (req, res) => {
    const store = getSecurityStore();
    res.json(store.keys);
  });

  // UPDATE KEY
  app.post("/api/admin/keys/update", (req, res) => {
    const { role, newKey } = req.body;
    const store = getSecurityStore();

    store.keys[role] = newKey;
    saveSecurityStore(store);

    res.json({ success: true });
  });

  // ROTATE ALL
  app.post("/api/admin/keys/rotate-all", (req, res) => {
    const store = getSecurityStore();
    const newKeys = { ...store.keys };

    Object.keys(newKeys).forEach((role) => {
      if (role !== "CEO") {
        newKeys[role] = generateRandomKey(role.substring(0, 3));
      }
    });

    store.keys = newKeys;
    store.lastRotation = new Date().toISOString();

    saveSecurityStore(store);

    res.json({
      success: true,
      keys: store.keys,
    });
  });

  // SEND MFA
  app.post("/api/send-mfa", async (req, res) => {
    const { code, email, role } = req.body;

    if (!code || !email) {
      return res.status(400).json({
        error: "Code and email are required.",
      });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      try {
        const isGmail =
          SMTP_HOST.includes("gmail.com") || SMTP_USER.includes("@gmail.com");

        const transportConfig: any = isGmail
          ? {
              service: "gmail",
              auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
              },
            }
          : {
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
          from: `"MADECC Security" <${SMTP_USER}>`,
          to: email,
          subject: `CEO TERMINAL CODE`,
          text: `Your MFA code: ${code}`,
        });
      } catch (error) {
        console.error(error);
      }
    }

    res.json({ success: true });
  });

  // DEV / PROD
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();