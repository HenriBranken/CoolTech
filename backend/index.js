const express = require("express");
const db = require("./db/index");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const credsRouter = require("./routers/credential.router");
const employeeRouter = require("./routers/employee.router");
const dataRouter = require("./routers/data.router");
const resourceRouter = require("./routers/resources.router");

dotenv.config();

// Set Up Server
const app = express();
const PORT = process.env.PORT || process.env.BACKEND_PORT;
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}.`);
});

app.use(express.json()); // Apply for any/all incoming request.
app.use(cookieParser()); // Parse the incoming Cookies into the `req.cookies` object.

// credentials: true (Cookies, Authorization Headers, TLS Client Certificates)
// Configures the Acc ess-Control-Allow-Credentials CORS header.
// Set to true to pass the header, otherwise it is omitted.
// Allows the browser to set credentials.
app.use(
  cors({
    origin: [`http://localhost:${process.env.FRONTEND_PORT}`],
    credentials: true, // Allows Cookies from the `origin` above.
  })
);

db.on("error", (error) => {
  console.log(error);
  process.exit();
});
db.on("connected", () => {
  console.log("    Connected to MongoDB using MongooseJS.");
});
db.once("open", () => {
  console.log("  > Mongo Connection Established.");
});

// Set up the Routes.
app.use("/cred", credsRouter);
app.use("/employee", employeeRouter);
app.use("/data", dataRouter);
app.use("/resources", resourceRouter);
