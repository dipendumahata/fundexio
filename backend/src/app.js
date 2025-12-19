const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
// 🔴 TEMP: mongoSanitize comment kore rakho jokhon porjonto sob stable na hoy
const mongoSanitize = require("express-mongo-sanitize");

const authRouter = require("./routes/auth.routes");
const proposalRouter = require("./routes/proposal.routes");
const investmentRouter = require("./routes/investment.routes");
const chatRouter = require("./routes/chat.routes");
const loanRouter = require("./routes/loan.routes");
const advisoryRouter = require("./routes/advisory.routes");

const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.disable("x-powered-by");
// 🔴 TEMP: mongoSanitize comment kore rakho jokhon porjonto sob stable na hoy
app.use(mongoSanitize());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/proposals", proposalRouter);
app.use("/api/v1/investments", investmentRouter);
app.use("/api/v1/dashboard", require("./routes/dashboard.routes"));
app.use("/api/v1/notifications", require("./routes/notification.routes"));
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/loans", loanRouter);
app.use("/api/v1/advisory", advisoryRouter);
// ⬇️ must be last
app.use(errorHandler);

module.exports = { app };
