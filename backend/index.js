import express from "express";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // обязательно, чтобы читать JSON из body

// указываем папку с фронтендом как статическую для css и js

app.use(express.static(path.resolve("../frontend/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});

app.post("/api/v1/zakaz", (req, res) => {
  const { name, value } = req.body;
});

app.listen(PORT, "localhost", () => {
  console.log(`СЕРВЕР ЗАПУЩЕН: http://localhost:${PORT}`);
});
