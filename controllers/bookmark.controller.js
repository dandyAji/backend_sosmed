import prisma from "../utils/prisma.js";

export const toggleSave = async (req, res) => {
  const { postId } = req.params;
  const currentUserId = req.user.id;

  try {
    // validasi
    const postData = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!postData) {
      return res.status(404).json({ message: "Post not found" });
    }

    // is user already bookmarked this post?
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: Number(currentUserId),
          postId: Number(postId),
        },
      },
    });

    if (existingBookmark) {
      // if already bookmarked, remove the bookmark
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId: Number(currentUserId),
            postId: Number(postId),
          },
        },
      });
      return res.status(200).json({ message: "Bookmark removed" });
    }

    // if not bookmarked, create a new bookmark
    const newBookmark = await prisma.bookmark.create({
      data: {
        userId: Number(currentUserId),
        postId: Number(postId),
        content: "",
      },
    });

    res.status(201).json({ message: "Post bookmarked", data: newBookmark });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const CheckSavedFeed = async (req, res) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.user.id;

    const checkSaved = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: Number(currentUserId),
          postId: Number(postId),
        },
      },
    });

    if (checkSaved) {
      return res.status(200).json({ saved: true });
    } else {
      return res.status(200).json({ saved: false });
    }
  } catch (error) {
    console.error("Error checking bookmark:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
