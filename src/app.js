express = require("express");
fileLogger = require("./morgan");
logger = require("./logger");

app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.json());
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(fileLogger);

app.get("/", function (req, res) {
  const address = {
    request_ip: req.ip,
  };

  const headers = {
    request_headers: req.headers,
  };

  res.render("index.ejs", {
    address: address,
    headers: JSON.stringify(headers, null, 4),
  });
});

app.listen(PORT, () => {
  console.log("Server started on http://localhost:" + PORT + "\n");
});
