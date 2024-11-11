if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const routes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.get("/", (req, res) => {
  res.send("aku di sini cuy ahay 1");
});

app.listen(PORT, () => {
  console.log(`Aku tresno ${PORT}`);
});
