const mongoose = require("mongoose");

mongoose.connection.once("open", () => {
  console.log("MongoDB Connection is ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect(DATABASE) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(DATABASE);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
