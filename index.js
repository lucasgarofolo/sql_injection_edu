const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("./database.db");

// Criação da tabela e inserção de dados fictícios
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("INSERT INTO users (username, password) VALUES ('admin', 'admin123')");
  db.run("INSERT INTO users (username, password) VALUES ('user1', 'password1')");
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/login", (req, res) => {
  let username = req.query.username || "";
  let password = req.query.password || "";

  // 🚨 VULNERÁVEL A INJEÇÃO DE SQL 🚨
  let query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log("Query executada:", query);

  db.all(query, [], (err, rows) => {
    if (err) {
      res.send("Erro no banco de dados.");
      return;
    }
    if (rows.length > 0) {
      res.send("Login bem-sucedido! Bem-vindo, " + username);
    } else {
      res.send("Usuário ou senha incorretos!");
    }
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});