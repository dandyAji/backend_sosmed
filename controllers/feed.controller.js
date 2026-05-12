import prisma from "../utils/prisma.js";
import cloudinary from "../utils/cloudinary.js";

export const CreateFeed = async (req, res) => {
  try {
    const { caption } = req.body;
    const curretUserId = req.user.id;

    // validation
    if (!caption) {
      res.status(400).json({
        message: "caption harus diisi",
      });
    }

    if (!req.file) {
      res.status(400).json({
        message: "image harus diisi",
      });
    }

    // upload gambar dengan buffer multer
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: "feeds",
      transformation: [
        {
          aspect_ration: "4:5",
          crop: "fill",
          gravity: "auto",
        },
        {
          quality: "auto",
          fect_format: "auto",
        },
      ],
    });

    // buat postingan baru
    const newFeed = await prisma.post.create({
      data: {
        userId: curretUserId,
        image: result.secure_url,
        imageId: result.public_id,
        caption: caption,
      },
    });

    // update data user
    await prisma.user.update({
      where: {
        id: curretUserId,
      },
      data: {
        postCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json({
      message: "berhasil membuat feed",
      data: newFeed,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "terjadi kesalahan pada server",
    });
  }
};

// ambil feed berdasarkan user yang difollow dan kita
export const ReadAllFeeds = async (req, res) => {
  try {
    const curretUserId = req.user.id;

    const followings = await prisma.follow.findMany({
      where: {
        followingId: curretUserId,
      },
      select: {
        followerId: true,
      },
    });

    const followingIds = followings.map((following) => following.followerId);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    const totalFeed = await prisma.post.count({
      where: {
        userId: {
          in: [...followingIds, curretUserId],
        },
      },
    });

    const Posts = await prisma.post.findMany({
      where: {
        userId: {
          in: [...followingIds, curretUserId],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            image: true,
            fullname: true,
            username: true,
          },
        },
      },
      orderBy: {
        createAt: "desc",
      },
      skip,
      take: limit,
    });

    const totalPage = Math.ceil(totalFeed / limit);

    res.status(200).json({
      message: "berhasil mendapatkan data feed",
      page,
      limit,
      totalPage,
      totalFeed,
      data: Posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "terjadi kesalahan pada server",
    });
  }
};

export const detailFeed = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            image: true,
            fullname: true,
            username: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createAt: true,
            user: {
              select: {
                id: true,
                image: true,
                fullname: true,
                username: true,
                createAt: true,
              },
            },
          },
          orderBy: {
            createAt: "desc",
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "post tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "berhasil mendapatkan data feed",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "terjadi kesalahan pada server",
    });
  }
};

export const deleteFeed = async (req, res) => {
  const { id } = req.params;

  try {
    const postData = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!postData) {
      return res.status(404).json({
        message: "post tidak ditemukan",
      });
    }

    if (postData.userId !== req.user.id) {
      return res.status(400).json({
        message: "anda tidak bisa menghapus feed ini",
      });
    }

    if (postData.imageId) {
      await cloudinary.uploader.destroy(postData.imageId);
    }

    await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "berhasil menghapus feed",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "terjadi kesalahan pada server",
    });
  }
};
