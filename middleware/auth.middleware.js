import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

export const authMiddleware = async (req, res, next) => {
  const JWTSECRET = process.env.JWTSECRET;

  try {
    const headers = req.headers.authorization;

    if (!headers) {
      return res.status(401).json({
        message: "anda harus login terlebih dahulu",
      });
    }

    const token = headers.split(" ")[1];
    const decode = jwt.verify(token, JWTSECRET);

    const currentUser = await prisma.user.findUnique({
      where: {
        id: decode.id,
      },
    });

    req.user = {
      id: currentUser.id,
      fullname: currentUser.fullname,
      username: currentUser.username,
      email: currentUser.email,
      image: currentUser.image,
      bio: currentUser.bio,
    };

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "terjadi kesalahan pada server",
    });
  }
};
