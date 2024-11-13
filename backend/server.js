import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(cors({
  origin: process.env.URI,
  credentials: true
}));

// JWT secret keys
const SECRET_KEY = process.env.SECRET_KEY_TOKEN;
const REFRESH_SECRET_KEY = process.env.SECRET_KEY_REFRESH_TOKEN;

const admin = {
  id: 1,
  username: "admin",
  password: "admin123",
  name: "Khaireddine"
};

let refreshTokens = [];

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ id: user.id, username: user.username }, REFRESH_SECRET_KEY, { expiresIn: "1h" });
  refreshTokens.push(refreshToken);
  return refreshToken;
};

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (username.toLowerCase() !== admin.username.toLowerCase() || password !== admin.password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  try {
    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    res.json({
      accessToken,
      refreshToken,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token is expired or invalid" });
    }
    req.userId = decoded.id;
    next();
  });
};

app.post("/refreshToken", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ message: "Refresh token is invalid" });
  }

  jwt.verify(token, REFRESH_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Refresh token is expired or invalid" });
    }

    const newAccessToken = generateAccessToken({ id: decoded.id, username: decoded.username });
    res.json({ accessToken: newAccessToken });
  });
});

app.get("/admin", verifyToken, (req, res) => {
  res.json(admin);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
