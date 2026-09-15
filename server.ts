import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface RSVPRecord {
  id: string;
  guestName: string;
  attending: boolean;
  hasCompanions: boolean;
  companions: string[];
  createdAt: string;
  updatedAt: string;
  phone?: string;
  message?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "rsvps.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error("Failed to create data directory:", e);
  }
}

// Initial seed data if file doesn't exist
const INITIAL_RSVPS: RSVPRecord[] = [
  {
    id: "rsvp-1",
    guestName: "Carla Silveira Gessi",
    attending: true,
    hasCompanions: true,
    companions: ["Roberto Gessi", "Lucas Gessi"],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    message: "Muito orgulho de você, minha querida! Estaremos lá com certeza!"
  },
  {
    id: "rsvp-2",
    guestName: "Mariana Vasconcelos",
    attending: true,
    hasCompanions: false,
    companions: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    message: "Parabéns amiga linda!! Não perco por nada!"
  },
  {
    id: "rsvp-3",
    guestName: "Felipe Andrade",
    attending: true,
    hasCompanions: true,
    companions: ["Beatriz Lima"],
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString()
  }
];

function loadRSVPs(): RSVPRecord[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading RSVP file, using initial data:", err);
  }
  saveRSVPs(INITIAL_RSVPS);
  return INITIAL_RSVPS;
}

function saveRSVPs(rsvps: RSVPRecord[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(rsvps, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving RSVPs to file:", err);
  }
}

let rsvpStore: RSVPRecord[] = loadRSVPs();

function normalizeName(name: string): string {
  return name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", count: rsvpStore.length });
  });

  // Get all RSVPs & Stats
  app.get("/api/rsvp", (req, res) => {
    const totalResponses = rsvpStore.length;
    const attendingCount = rsvpStore.filter(r => r.attending).length;
    const declinedCount = rsvpStore.filter(r => !r.attending).length;
    const totalCompanionsCount = rsvpStore
      .filter(r => r.attending)
      .reduce((acc, r) => acc + (r.companions ? r.companions.length : 0), 0);
    const totalGuestsAndCompanions = attendingCount + totalCompanionsCount;

    res.json({
      rsvps: rsvpStore,
      stats: {
        totalResponses,
        attendingCount,
        declinedCount,
        totalCompanionsCount,
        totalGuestsAndCompanions
      }
    });
  });

  // Check if name already exists
  app.get("/api/rsvp/check", (req, res) => {
    const name = req.query.name as string;
    if (!name) {
      return res.status(400).json({ error: "Nome não fornecido" });
    }
    const norm = normalizeName(name);
    const existing = rsvpStore.find(r => normalizeName(r.guestName) === norm);
    res.json({ exists: !!existing, rsvp: existing || null });
  });

  // Submit or update RSVP
  app.post("/api/rsvp", (req, res) => {
    const { guestName, attending, hasCompanions, companions, phone, message } = req.body;

    if (!guestName || typeof guestName !== "string" || !guestName.trim()) {
      return res.status(400).json({ error: "Nome completo é obrigatório." });
    }

    const trimmedName = guestName.trim();
    const norm = normalizeName(trimmedName);
    const existingIndex = rsvpStore.findIndex(r => normalizeName(r.guestName) === norm);

    const cleanedCompanions = Array.isArray(companions)
      ? companions.map((c: string) => String(c).trim()).filter((c: string) => c.length > 0)
      : [];

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      // Update existing
      const updated: RSVPRecord = {
        ...rsvpStore[existingIndex],
        guestName: trimmedName,
        attending: Boolean(attending),
        hasCompanions: Boolean(hasCompanions && cleanedCompanions.length > 0),
        companions: Boolean(attending) ? cleanedCompanions : [],
        updatedAt: now,
        phone: phone ? String(phone).trim() : rsvpStore[existingIndex].phone,
        message: message ? String(message).trim() : rsvpStore[existingIndex].message
      };
      rsvpStore[existingIndex] = updated;
      saveRSVPs(rsvpStore);
      return res.json({ success: true, isUpdate: true, rsvp: updated });
    } else {
      // Create new
      const newRecord: RSVPRecord = {
        id: "rsvp-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        guestName: trimmedName,
        attending: Boolean(attending),
        hasCompanions: Boolean(hasCompanions && cleanedCompanions.length > 0),
        companions: Boolean(attending) ? cleanedCompanions : [],
        createdAt: now,
        updatedAt: now,
        phone: phone ? String(phone).trim() : undefined,
        message: message ? String(message).trim() : undefined
      };
      rsvpStore.unshift(newRecord);
      saveRSVPs(rsvpStore);
      return res.status(201).json({ success: true, isUpdate: false, rsvp: newRecord });
    }
  });

  // Delete RSVP
  app.delete("/api/rsvp/:id", (req, res) => {
    const { id } = req.params;
    const initialLen = rsvpStore.length;
    rsvpStore = rsvpStore.filter(r => r.id !== id);
    if (rsvpStore.length < initialLen) {
      saveRSVPs(rsvpStore);
      res.json({ success: true, message: "Confirmação removida com sucesso." });
    } else {
      res.status(404).json({ error: "Registro não encontrado." });
    }
  });

  // Export CSV
  app.get("/api/rsvp/export", (req, res) => {
    let csv = "ID,Convidado,Status,Acompanhantes,Total Pessoas,Data de Confirmação,Mensagem\n";
    for (const r of rsvpStore) {
      const status = r.attending ? "Confirmado (SIM)" : "Não poderá ir (NÃO)";
      const compList = r.companions && r.companions.length > 0 ? `"${r.companions.join("; ")}"` : '""';
      const totalPeople = r.attending ? 1 + (r.companions?.length || 0) : 0;
      const date = new Date(r.updatedAt || r.createdAt).toLocaleString("pt-BR");
      const msg = r.message ? `"${r.message.replace(/"/g, '""')}"` : '""';
      csv += `"${r.id}","${r.guestName.replace(/"/g, '""')}","${status}",${compList},${totalPeople},"${date}",${msg}\n`;
    }

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="lista-presenca-formatura-ana-julia.csv"');
    res.send("\uFEFF" + csv); // Include UTF-8 BOM for Excel
  });

  // Vite middleware for development vs static build in production
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
