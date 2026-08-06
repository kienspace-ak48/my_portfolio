const userRepo = require("../repositories/user.repository");
const refreshTokenRepo = require("../repositories/refreshToken.repository");
const bcrypt = require("../utils/bcrypt.util");
const jwt = require("../utils/jwt.util");

const REFRESH_TOKEN_MS = 7 * 24 * 60 * 60 * 1000;

function toSafeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

async function login(email, password) {
  const user = await userRepo.findByEmail(email);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = jwt.signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = jwt.signRefreshToken({ id: user.id });

  await refreshTokenRepo.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_MS),
  });

  return {
    accessToken,
    refreshToken,
    user: toSafeUser(user),
  };
}

async function refresh(refreshToken) {
  if (!refreshToken) {
    throw new Error("MISSING_REFRESH_TOKEN");
  }

  let decoded;
  try {
    decoded = jwt.verifyRefreshToken(refreshToken);
  } catch {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const stored = await refreshTokenRepo.findByToken(refreshToken);
  if (!stored || stored.expiresAt < new Date()) {
    if (stored) {
      await refreshTokenRepo.removeByToken(refreshToken);
    }
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const user = await userRepo.findById(decoded.id);
  if (!user) {
    await refreshTokenRepo.removeByToken(refreshToken);
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const accessToken = jwt.signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { accessToken };
}

async function logout(refreshToken) {
  if (refreshToken) {
    await refreshTokenRepo.removeByToken(refreshToken);
  }
}

async function getProfile(userId) {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return toSafeUser(user);
}

module.exports = {
  login,
  refresh,
  logout,
  getProfile,
};
