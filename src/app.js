express = require("express");
fileLogger = require("./morgan");
logger = require("./logger");

app = express();

const DOCKER = process.env.DOCKER || false;
const PORT = process.env.PORT || 3000;

const datafolder = (() => {
  return DOCKER ? { root: "./data" } : { root: "/app/data" };
})();

const address = (() => {
  return DOCKER
    ? require("os").networkInterfaces().eth0[0].address
    : "127.0.0.1";
})();

// Override ExpressJS API in order to match req.ip
// with 'cf-connecting-ip' headers when deploying
// app behind cloudflare proxy
if (process.env.NODE_ENV == "production") {
  Object.defineProperty(app.request, "ip", {
    configurable: true,
    enumerable: true,
    get() {
      return this.get("cf-connecting-ip");
    },
  });
}

app.use(express.json());
app.use(fileLogger);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.set("x-powered-by", false);

app.get("/", (req, res) => {
  res.status(200).send({
    address: req.ip,
    method: req.method,
    protocol: req.protocol,
    header: req.headers,
  });
});

app.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "200" });
});

app.listen(PORT, () => {
  logger.info("Server started on http://" + address + ":" + PORT + "\n");
});
