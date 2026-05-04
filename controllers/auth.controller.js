import * as z from "zod";
import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const RegisterUser = async (req, res) => {
  try {
    // validation
    const userSchema = z.object({
      fullname: z.string().min(6, "fullname minimal 6 karakter"),
      username: z.string().min(6, "username minimal 6 karakter"),
      email: z.string().email("email tidak valid"),
      password: z.string().min(8, "password minimal 8 karakter"),
    });

    const validated = userSchema.parse(req.body);

    // cek apakah email dan username sudah terdaftar atau tidak
    const emailExiting = await prisma.user.findUnique({
      where: {
        email: validated.email,
      },
    });

    if (emailExiting) {
      return res.status(400).json({
        message: "email sudah terdaftar, silahkan gunakan email yang lain",
      });
    }

    const usernameExiting = await prisma.user.findUnique({
      where: {
        username: validated.username,
      },
    });

    if (usernameExiting) {
      return res.status(400).json({
        message: "username sudah terdaftar, silahkan gunakan username yang lain",
      });
    }

    // enkripsi password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(validated.password, salt);

    // insert data ke database
    const newUser = await prisma.user.create({
      data: {
        fullname: validated.fullname,
        username: validated.username,
        email: validated.email,
        password: hashedPassword,
      },
    });

    const jwtSecret = process.env.JWTSECRET;
    const token = jwt.sign({ id: newUser.id }, jwtSecret, { expiresIn: "6d" });

    return res.status(201).json({
      message: "user berhasil didaftarkan",
      data: {
        id: newUser.id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        image: newUser.image,
        bio: newUser.bio,
      },
      token: token,
    });
  } catch (err) {
    if (err instanceof Error && "issues" in err) {
      // zod
      const errors = err.issues.map((i) => i.message);
      return res.status(400).json({
        message: errors,
      });
    }

    // error dari express

    console.log(err);
    res.status(500).json({
      message: "terjadi kesalahan pada server",
    });
  }
};

export const LoginUser = async (req, res) => {
  try {
    //   validation email dan password
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email dan password harus diisi",
      });
    }

    const exixtingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!exixtingEmail) {
      return res.status(400).json({
        message: "email tidak terdaftar",
      });
    }

    //   compare password request dengan password yang ada di database dengan bcrypt
    const comparePassword = bcrypt.compareSync(password, exixtingEmail.password);

    if (!comparePassword) {
      return res.status(400).json({
        message: "password yang anda masukkan salah",
      });
    }

    //   buat token dengan jwt dan simpan id user ke jwt
    const jwtSecret = process.env.JWTSECRET;
    const token = jwt.sign({ id: exixtingEmail.id }, jwtSecret, { expiresIn: "6d" });

    //   respon sukses
    return res.status(200).json({
      message: "login berhasil",
      data: {
        id: exixtingEmail.id,
        fullname: exixtingEmail.fullname,
        username: exixtingEmail.username,
        email: exixtingEmail.email,
        image: exixtingEmail.image,
        bio: exixtingEmail.bio,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "terjadi kesalahan pada server.",
    });
  }
};

export const GetUser = async (req, res) => {
  res.status(200).json({
    message: "berhasil mendapatkan data user",
    data: req.user,
  });
};
