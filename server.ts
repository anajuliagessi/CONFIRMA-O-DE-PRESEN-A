import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from "./firebase-applet-config.json";

// Initialize Firebase Admin
const app = initializeApp({
  projectId: firebaseConfig.projectId,
});

const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const rsvpCollection = db.collection('rsvps');

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

function normalizeName(name: string): string {
  return name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", async (req, res) => {
    const snapshot = await rsvpCollection.get();
    res.json({ status: "ok", count: snapshot.size });
  });

  // Get all RSVPs & Stats
  app.get("/api/rsvp", async (req, res) => {
    const snapshot = await rsvpCollection.get();
    const rsvps = snapshot.docs.map(doc => doc.data() as RSVPRecord);
    
    const totalResponses = rsvps.length;
    const attendingCount = rsvps.filter(r => r.attending).length;
    const declinedCount = rsvps.filter(r => !r.attending).length;
    const totalCompanionsCount = rsvps
      .filter(r => r.attending)
      .reduce((acc, r) => acc + (r.companions ? r.companions.length : 0), 0);
    const totalGuestsAndCompanions = attendingCount + totalCompanionsCount;

    res.json({
      rsvps,
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
  app.get("/api/rsvp/check", async (req, res) => {
    const name = req.query.name as string;
    if (!name) {
      return res.status(400).json({ error: "Nome não fornecido" });
    }
    const norm = normalizeName(name);
    
    const snapshot = await rsvpCollection.get();
    const rsvps = snapshot.docs.map(doc => doc.data() as RSVPRecord);
    const existing = rsvps.find(r => normalizeName(r.guestName) === norm);
    
    res.json({ exists: !!existing, rsvp: existing || null });
  });

  // Submit or update RSVP
  app.post("/api/rsvp", async (req, res) => {
    console.log("RSVP Submission received:", JSON.stringify(req.body, null, 2));
    const { guestName, attending, hasCompanions, companions, phone, message } = req.body;

    if (!guestName || typeof guestName !== "string" || !guestName.trim()) {
      console.log("Validation failed: guestName is missing or invalid");
      return res.status(400).json({ error: "Nome completo é obrigatório." });
    }

    const trimmedName = guestName.trim();
    const norm = normalizeName(trimmedName);
    
    const snapshot = await rsvpCollection.get();
    const existingDoc = snapshot.docs.find(doc => normalizeName((doc.data() as RSVPRecord).guestName) === norm);

    const cleanedCompanions = Array.isArray(companions)
      ? companions.map((c: string) => String(c).trim()).filter((c: string) => c.length > 0)
      : [];

    const now = new Date().toISOString();

    if (existingDoc) {
      // Update existing
      const existingData = existingDoc.data() as RSVPRecord;
      const updated: RSVPRecord = {
        ...existingData,
        guestName: trimmedName,
        attending: Boolean(attending),
        hasCompanions: Boolean(hasCompanions && cleanedCompanions.length > 0),
        companions: Boolean(attending) ? cleanedCompanions : [],
        updatedAt: now,
        phone: phone ? String(phone).trim() : existingData.phone,
        message: message ? String(message).trim() : existingData.message
      };
      
      await existingDoc.ref.update(updated);
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
      
      await rsvpCollection.doc(newRecord.id).set(newRecord);
      return res.status(201).json({ success: true, isUpdate: false, rsvp: newRecord });
    }
  });

  // Delete RSVP
  app.delete("/api/rsvp/:id", async (req, res) => {
    const { id } = req.params;
    const docRef = rsvpCollection.doc(id);
    const doc = await docRef.get();
    
    if (doc.exists) {
      await docRef.delete();
      res.json({ success: true, message: "Confirmação removida com sucesso." });
    } else {
      res.status(404).json({ error: "Registro não encontrado." });
    }
  });

  // Export CSV
  app.get("/api/rsvp/export", async (req, res) => {
    const snapshot = await rsvpCollection.get();
    const rsvps = snapshot.docs.map(doc => doc.data() as RSVPRecord);
    
    let csv = "ID,Convidado,Status,Acompanhantes,Total Pessoas,Data de Confirmação,Mensagem\n";
    for (const r of rsvps) {
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
