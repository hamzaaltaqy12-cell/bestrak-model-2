/* بستراك — خادم ثابت صغير، بلا أي حزمة خارجية.
   التشغيل:  node server.js        ثم افتح  http://localhost:5180
   لتغيير المنفذ:  set PORT=8080 && node server.js                */

const http = require("http");
const fs   = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5180;
const ROOT = __dirname;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css" : "text/css; charset=utf-8",
  ".js"  : "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg" : "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png" : "image/png",
  ".svg" : "image/svg+xml",
  ".webp": "image/webp",
  ".ico" : "image/x-icon",
};

const server = http.createServer(function (req, res) {
  let route = decodeURIComponent(req.url.split("?")[0]);
  if (route === "/" || route === "") route = "/index.html";

  // نبني المسار من أجزاء نظيفة بدل تعابير نمطية — فلا خروج عن مجلّد الموقع
  const parts = route.split("/").filter(function (p) {
    return p && p !== "." && p !== "..";
  });
  const full = path.join(ROOT, parts.join(path.sep));

  fs.readFile(full, function (err, buf) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1 style='font-family:sans-serif'>الصفحة غير موجودة</h1>");
      return;
    }
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(full).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(buf);
  });
});

server.on("error", function (e) {
  if (e.code === "EADDRINUSE") {
    console.error("المنفذ " + PORT + " مشغول. جرّب:  set PORT=5181 && node server.js");
  } else {
    console.error(e.message);
  }
  process.exit(1);
});

server.listen(PORT, function () {
  console.log("بستراك يعمل الآن على:  http://localhost:" + PORT);
});
