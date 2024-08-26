require("dotenv").config();

const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const app = express();

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const dbConnector = require('./config/dbConnect');

const PORT = process.env.PORT || 3000;

let server;  // Declare a variable to hold the server instance

// Initiate the connection
dbConnector.connect();

//custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));
// app.use(cors());

//built in middleware to handle urlencoded data
// in other words, form data:
// 'Content-Type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

//built in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//routes
app.get("/", (req, res) => res.send("vercel backend(NODEJS/EXPRESSJS) deployment successful!"))
app.use(
  "/register",
  require("./routes/register") 
);
app.use(
  "/login",
  require("./routes/login") 
);
app.use(
  "/refresh",
  require("./routes/refresh") 
);
app.use(
  "/logout",
  require("./routes/logout") 
);

app.use(
  "/books", verifyJWT,
  require("./routes/book") 
);
app.use(
  "/owners", verifyJWT,
  require("./routes/owner") 
);

app.use("/earn", verifyJWT,
  require("./routes/earn")
)
// default(404)
app.all("*", (req, res) => {
  res.status(404).json({ error: "404 Not Found!" });
});

// custom error handler
app.use(errorHandler);

// Listen for the 'connected' event to start the server
dbConnector.on('connected', () => {
  server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

// Optionally handle the 'error' event
dbConnector.on('error', (error) => {
  console.error("Connection error: ", error);
  process.exit(1); // Exit the process if there's a connection error
});


// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down server...");
  await dbConnector.disconnect();
  server.close(() => {
    console.log("Server shut down");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
