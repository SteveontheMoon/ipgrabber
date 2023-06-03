const express = require("express");

const fileLogger = require("./morgan");
const logger = require("./logger");
const api_router = require('./api_route')
const post_router = require('./post_route')

const app = express();

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

// Override ExpressJS API in order to match req.ipu
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

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.set("x-powered-by", false);
app.use("/json", api_router);
app.use("/p", post_router);
app.use(express.json());
app.use(fileLogger);
app.use((err, req, res, next) => {
  //send
  console.error(err.stack);
  res.status(500).send(':(');
})

app.get("/", (req, res) => {
  res.send(req.ip + "\n")
});

app.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "200" });
});

app.listen(PORT, () => {
  logger.info("Server started on http://" + address + ":" + PORT + "\n");
});
