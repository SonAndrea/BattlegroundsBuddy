import express from "express";
import axios from "axios";
import crypto from "crypto";

const router = express.Router();

// Route to start OAuth
router.get("/oauth", (req, res) => {
  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const redirectUri = process.env.BLIZZARD_REDIRECT_URI;
  const state = crypto.randomBytes(16).toString("hex");

  res.cookie("oauth_state", state, {
    httpOnly: true,
    maxAge: 300000 // 5 minutes
  });

  const url = `https://oauth.battle.net/authorize?client_id=${clientId}&scope=openid&response_type=code&redirect_uri=${redirectUri}&state=${state}`;
  res.redirect(url);
});

// OAuth callback handler
router.get("/oauth/callback", async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies.oauth_state;

  if (!state || !storedState || state !== storedState) {
    return res.status(400).send("Invalid or missing state parameter.");
  }

  res.clearCookie("oauth_state");

  try {
    const tokenResponse = await axios.post(
      "https://oauth.battle.net/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.BLIZZARD_REDIRECT_URI
      }),
      {
        auth: {
          username: process.env.BLIZZARD_CLIENT_ID,
          password: process.env.BLIZZARD_CLIENT_SECRET
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const userInfo = await axios.get("https://us.battle.net/oauth/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const battleTag = userInfo.data.battletag;

    res.cookie("session", battleTag, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.redirect(`http://localhost:5173/user?battletag=${encodeURIComponent(battleTag)}`);
  } catch (error) {
    console.error("OAuth callback error:", error.message);
    res.status(500).send("Failed to authenticate");
  }
});

export default router;