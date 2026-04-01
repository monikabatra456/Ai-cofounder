import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { INVESTORS } from "./src/constants.ts";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Search Investors (Data Extraction Assistant)
  app.get("/api/investors/search", (req, res) => {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const q = String(query).toLowerCase();
    const results = INVESTORS.filter(inv => 
      inv.city.toLowerCase().includes(q) || 
      inv.focus.some(f => f.toLowerCase().includes(q)) ||
      inv.name.toLowerCase().includes(q)
    ).map(inv => ({
      investor_name: inv.name,
      fund_name: inv.fund,
      location: inv.city + ", " + inv.area,
      focus_areas: inv.focus,
      email_address: inv.email,
      phone_number: "Not Available",
      linkedin_url: "Not Available",
      office_address: inv.officeAddress
    }));

    res.json(results);
  });

  // API: Send Email (Nodemailer)
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, text } = req.body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: "Email credentials not configured" });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      res.json({ success: true, info: info.response });
    } catch (error) {
      console.error("Email Error:", error);
      res.status(500).json({ error: String(error) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
