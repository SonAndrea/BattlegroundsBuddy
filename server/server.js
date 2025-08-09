import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import pool from "./database/db.js";

const app = express();
const port = 4000;

dotenv.config();    

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use("/", authRoutes);

app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`);
});

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



// Login user
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

    if (userResult.rows.length === 0) {
      return res.status(404).json({ loggedIn: false });
    }

    const userId = userResult.rows[0].id;

    const matchesResult = await pool.query(
      `SELECT hero_name, placement, post_match_mmr, comp_tags, match_date 
      FROM match_entries WHERE user_id = $1`,
      [userId]
    );

    return res.json({
      loggedIn: true,
      battleTag: sessionCookie,
      match_entries: matchesResult.rows,
    });
    
  } catch (err) {
    console.error("Error in /user route:", err);
    return res.status(500).json({ error: "DB error" });
  }
});

// Send user match data
app.post("/user", express.json(), async (req, res) => {
  const session = req.cookies.session;

  if (!session) {
    console.error("User not logged in");
    return res.status(401).json({error: "Not logged in"});
  }
    
  const { hero_name, placement, post_match_mmr, comp_tags } = req.body;
  console.log("Received match data:", { hero_name, placement, post_match_mmr, comp_tags });

  try {
  
    const userResult = await pool.query(
      `SELECT id FROM users WHERE battletag = $1`,
      [session]
    );

    if (userResult.rows.length === 0) {
      console.error("User not found for battletag:", session);
      return res.status(404).json({error: "User not found"});
    }

    const userId = userResult.rows[0].id;
    console.log("User ID found:", userId);

    const insertResult = await pool.query(
      `INSERT INTO match_entries (user_id, hero_name, placement, post_match_mmr, comp_tags) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [userId, hero_name, placement, post_match_mmr, comp_tags]
    );

    console.log("Inserted row:", insertResult.rows[0]);
    return res.json(insertResult.rows[0]);

  } catch (error) {
    console.error("Insert error:", error);
    return res.status(500).json({ error: "Failed to insert match" });
  }

});



// Logout
app.get("/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/");
});



