const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const fileLogger = require("./morgan");
const logger = require("./logger");
const api_router = require('./route/json')
const post_router = require('./route/post')

const DOCKER = process.env.DOCKER || false;
const PORT = process.env.PORT || 3000;
const TG_TOKEN = process.env.TG_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const app = express();
const bot = new TelegramBot(TG_TOKEN);

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
  let ip = req.ip;
  let headers = req.headers;
  let method = req.method;
  let protocol = req.protocol;
  
  let data = `ip: ${ip}\nmethod: ${method}\nprotocol: ${protocol}\n`;
  for(let [header, value] of Object.entries(headers)) {
    data += `${header}: ${value}\n`
  }
  bot.sendMessage(CHAT_ID, data);
  res.setHeader("Content-Type", "text/plain").send(data);
});

app.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "200" });
});

app.use((req, res, next) => {
  res.status(404).send("404\n");
})

app.listen(PORT, () => {
  logger.info("Server started on http://" + address + ":" + PORT + "\n");
});
