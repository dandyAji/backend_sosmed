import prisma from "../utils/prisma.js";

export const createComment = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const { postId, content } = req.body;

    if (!postId || !content) {
      res.status(400).json({
        message: "post id dan content harus diisi",
      });
    }

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

    // insert data
    const newComment = await prisma.comment.create({
      data: {
        content,
        userId: Number(currentUserId),
        postId: Number(postId),
      },
    });

    // update post count pada user
    await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json({
      message: "berhasil membuat komentar",
      data: newComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server down",
    });
  }
};

export const deleteCommentById = async (req, res) => {
  const { id } = req.params;
  const comment = await prisma.comment.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!comment) {
    return res.status(404).json({
      message: "comment tidak ditemukan",
    });
  }

  if (comment.userId !== req.user.id) {
    return res.status(400).json({
      message: "anda tidak bisa menghapus komentar ini",
    });
  }

  await prisma.comment.delete({
    where: {
      id: Number(id),
    },
  });

  await prisma.post.update({
    where: {
      id: comment.postId,
    },
    data: {
      commentCount: {
        decrement: 1,
      },
    },
  });

  res.status(200).json({
    message: "berhasil menghapus komentar",
  });
};
