import prisma from "../utils/prisma.js";

export const likeFeedUser = async (req, res) => {
  const currentUserId = req.user.id;
  const { postId } = req.params;

  try {
    // validation
    const postData = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!postData) {
      return res.status(404).json({
        message: "post tidak ditemukan",
      });
    }

    // check jika user sudah like post
    const checkLike = await prisma.likes.findUnique({
      where: {
        userId_postId: {
          userId: Number(currentUserId),
          postId: Number(postId),
        },
      },
    });

    if (checkLike) {
      await prisma.likes.delete({
        where: {
          userId_postId: {
            userId: Number(currentUserId),
            postId: Number(postId),
          },
        },
      });

      await prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });

      return res.status(200).json({
        message: "like berhasil dihapus",
      });
    }

    // insert data like
    const newLike = await prisma.likes.create({
      data: {
        userId: Number(currentUserId),
        postId: Number(postId),
        content: "",
      },
    });

    // update post
    await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json({
      message: "like berhasil ditambahkan",
      data: newLike,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server down",
    });
  }
};

export const CheckLikeUser = async (req, res) => {
  const currentUserId = req.user.id;
  const { postId } = req.params;

  try {
    const postData = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!postData) {
      return res.status(404).json({
        message: "post tidak ditemukan",
      });
    }

    const checkLike = await prisma.likes.findUnique({
      where: {
        userId_postId: {
          userId: Number(currentUserId),
          postId: Number(postId),
        },
      },
    });

    if (checkLike) {
      return res.status(200).json({
        data: true,
      });
    } else {
      return res.status(200).json({
        data: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server down",
    });
  }
};
