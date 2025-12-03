export default function auth(req, res, next) {
  // Проверяем заголовок Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.set("WWW-Authenticate", 'Basic realm="Restricted Area"');
    return res.status(401).send("Требуется авторизация");
  }

  // Получаем закодированные в base64 логин:пароль
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [login, password] = credentials.split(":");

  // Проверяем соответствие — замени на свои логин и пароль
  const adminLogin = process.env.ADMIN_LOGIN || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "secret";

  if (login === adminLogin && password === adminPassword) {
    return next(); // аутентификация пройдена
  } else {
    res.set("WWW-Authenticate", 'Basic realm="Restricted Area"');
    return res.status(401).send("Неверный логин или пароль");
  }
}
