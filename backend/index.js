import express from "express";
import path from "node:path";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import auth from "./auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Для использования verbose-режима нужно немного иначе:
const { verbose } = sqlite3;
const sqlite = verbose();
const db = new sqlite.Database("database.db");

app.use(express.json()); // обязательно, чтобы читать JSON из body
// указываем папку с фронтендом как статическую для css и js
app.use(express.static(path.resolve("../front/")));
app.use(express.urlencoded({ extended: true }));

// Создаем таблицу, если не существует
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    address TEXT,
    phone TEXT,
    specialization TEXT,
    message TEXT,
    agree INTEGER,
    created_at TEXT
  )`);
});

app.post("/apply", (req, res) => {
  const { name, address, phone, specialization, message, agree } = req.body;

  // 1. Берем текущее время и приводим к Asia/Yakutsk
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Yakutsk",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type).value;

  const day = get("day");
  const month = get("month");
  const year = get("year");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");

  // 2. Формат DD-MM-YYYY HH:MM:SS
  const createdAt = `${day}-${month}-${year} ${hour}:${minute}:${second}`;

  const stmt = db.prepare(`INSERT INTO applications 
    (name, address, phone, specialization, message, agree, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`);

  stmt.run(
    name,
    address,
    phone,
    specialization,
    message,
    agree ? 1 : 0,
    createdAt,
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send("Ошибка при сохранении заявки");
        return;
      }
      res.send(`Спасибо, ${name}, ваша заявка принята!`);
    }
  );

  stmt.finalize();
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});

app.get("/zayavki", auth, (req, res) => {
  res.sendFile(path.resolve("../front/zayavki.html"));
});

app.get("/api/applications", (req, res) => {
  db.all("SELECT * FROM applications", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows); // отправляет массив записей в JSON
  });
});

app.delete("/api/applications/:id", auth, (req, res) => {
  const id = parseInt(req.params.id); // ← добавь parseInt!
  db.run("DELETE FROM applications WHERE id = ?", [id], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Заявка не найдена" });
      return;
    }
    res.json({ message: "Заявка удалена" });
  });
});

app.listen(PORT, "localhost", () => {
  console.log(`СЕРВЕР ЗАПУЩЕН: http://localhost:${PORT}`);
});
