const express = require("express");
const router = express.Router();
const service = require("../service/service");
const path = require("path");
const htmlPath = path.join(__dirname, "../../frontend/src/html/");

function AuthMiddle(req, res, next) {
  if (req.session.user) {
    return next();
  }
  return res.redirect("/login");
}

router.get("/", AuthMiddle, (req, res) => {
  res.sendFile(path.join(htmlPath, "index.html"));
});

router.get("/layout", AuthMiddle, (req, res) => {
  res.sendFile(path.join(htmlPath, "layout.html"));
});

router.get("/analytics", AuthMiddle, (req, res) => {
  res.sendFile(path.join(htmlPath, "analytics.html"));
});

router.get("/historico/:id", AuthMiddle, (req, res) => {
  res.sendFile(path.join(htmlPath, "historico.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(htmlPath, "login.html"));
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    req.session.user = { username };
    return res.redirect("/");
  }

  res.status(401).json({ message: "Usuário ou senha inválidos" });
});

router.post("/create", AuthMiddle, async (req, res) => {
  await service.Cadastro(req, res);
});

router.post("/delete", AuthMiddle, async (req, res) => {
  await service.Delete(req, res);
});

router.post("/update", AuthMiddle, async (req, res) => {
  await service.Edicao(req, res);
});


module.exports = router;
