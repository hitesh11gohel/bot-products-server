const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connection successful"))
  .catch((err) => console.log("No Connection :", err))
