import prisma from "../utils/prisma.js";
import * as z from "zod";

export const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await prisma.user.findUnique({
            where: {
                username,
            },
            omit: {
                password: true,
                imageId: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "user tidak ditemukan",
            });
        }

        res.status(200).json({
            message: "berhasil mendapatkan data user",
            data: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "terjadi kesalahan pada server",
        });
    }
};

export const getSearchUser = async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({
            message: "username query parameter is required",
        });
    }

    const users = await prisma.user.findMany({
        where: {
            username: {
                contains: username,
                mode: "insensitive",
            },
        },
        select: {
            id: true,
            username: true,
            fullname: true,
            imageId: true,
        },
    });

    if (users.length === 0) {
        return res.status(404).json({
            message: "tidak ada user yang ditemukan",
        });
    }

    res.status(200).json({
        message: "berhasil mendapatkan data user",
        data: users,
    });
};

export const updateUser = async (req, res) => {
    try {
        // validation dengan zod

        const userSchema = z.object({
            fullname: z.string().min(6, "fullname minimal 6 karakter"),
            username: z.string().min(6, "username minimal 6 karakter"),
            bio: z.string().min(10, "bio minimal 10 karakter"),
        });
        const validated = userSchema.parse(req.body);

        // validasi untuk username
        const currentUser = await prisma.user.findUnique({
            where: {
                username: validated.username,
            },
        });

        if (currentUser) {
            return res.status(400).json({
                message: "username sudah terdaftar, silahkan gunakan username yang lain",
            });
        }

        // update user berdasarkan id
        const updatedUser = await prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: validated,
            omit: {
                password: true,
            },
        });

        // respon sukses
        res.status(200).json({
            message: "berhasil mengupdate data user",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);

        if (error instanceof Error && "issues" in error) {
            // zod
            const errors = error.issues.map((i) => i.message);
            return res.status(400).json({
                message: errors,
            });
        }

        return res.status(500).json({
            message: "terjadi kesalahan pada server",
        });
    }

    res.send("update user");
};
