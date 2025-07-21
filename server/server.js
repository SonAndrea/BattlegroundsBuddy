import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
const port = 4000;

dotenv.config();    

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use("/", authRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Main Page");
})

app.get("/oauth", (req, res) => {
    try {
        res.send("/oauth");
    } catch (error) {
        return res.json({error});
    }
});

app.get("/user", async (req, res) => {
  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    return res.status(401).json({ loggedIn: false });
  }

  try {
    const userResult = await pool.query(
      `SELECT id FROM users WHERE battletag = $1`,
      [sessionCookie]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResult.rows[0].id;

    const matchResult = await pool.query(
      `SELECT * FROM match_entries WHERE user_id = $1 ORDER BY match_date DESC`,
      [userId]
    );

    return res.json({
      loggedIn: true,
      battleTag: sessionCookie,
      matchHistory: matchResult.rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "DB error" });
  }
});

// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/");
});

// Server opened
app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`);
});

