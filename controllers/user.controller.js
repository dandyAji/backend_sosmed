import prisma from "../utils/prisma.js";

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
