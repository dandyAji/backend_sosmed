import prisma from "../utils/prisma.js";

export const followUserAccount = async (req, res) => {
  // current user dan follow user

  const curretUserId = req.user.id;
  const { followUserId } = req.body;

  // check jika curret user nilai nya sama dengan follow user id (jika follow diri sendiri)
  if (curretUserId === followUserId) {
    return res.status(400).json({
      message: "tidak bisa follow diri sendiri",
    });
  }

  const otherUserId = await prisma.user.findUnique({
    where: {
      id: Number(followUserId),
    },
  });

  if (!otherUserId) {
    return res.status(404).json({
      message: "user yang ingin di follow tidak ditemukan",
    });
  }

  const isFollowUser = await prisma.follow.findUnique({
    where: {
      followingId_followerId: {
        followerId: followUserId,
        followingId: Number(curretUserId),
      },
    },
  });

  if (isFollowUser) {
    return res.status(400).json({
      message: "Anda sudah mengikuti pengguna ini",
    });
  }

  try {
    const follow = await prisma.follow.create({
      data: {
        followerId: followUserId,
        followingId: Number(curretUserId),
        content: "",
      },
    });

    // update user count
    await prisma.user.update({
      where: {
        id: Number(curretUserId),
      },
      data: {
        followingCount: {
          increment: 1,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: Number(followUserId),
      },
      data: {
        followerCount: {
          increment: 1,
        },
      },
    });

    res.status(200).json({
      message: "berhasil mengikuti pengguna",
      data: follow,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Terjadi kesalahan saat mengikuti pengguna",
    });
  }
};

export const unfollowUserAccount = async (req, res) => {
  const { unfollowUserId } = req.params;
  const currentUserId = req.user.id;

  const userUnfollow = await prisma.user.findUnique({
    where: {
      id: Number(unfollowUserId),
    },
  });

  if (!userUnfollow) {
    return res.status(404).json({
      message: "user tidak ditemukan",
    });
  }

  try {
    await prisma.follow.delete({
      where: {
        followingId_followerId: {
          followerId: Number(unfollowUserId),
          followingId: Number(currentUserId),
        },
      },
    });

    // update count user following dan follower
    await prisma.user.update({
      where: {
        id: Number(currentUserId),
      },
      data: {
        followingCount: {
          decrement: 1,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: Number(unfollowUserId),
      },
      data: {
        followerCount: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({
      message: "User berhasil di unfollow",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server down",
    });
  }
};

export const getLimitUser = async (req, res) => {
  try {
    const curretUserId = req.user.id;

    const followedUser = await prisma.follow.findMany({
      where: {
        followerId: curretUserId,
      },
      select: {
        followerId: true,
      },
    });

    const followedIds = followedUser.map((user) => user.followingId);

    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: [...followedIds, curretUserId],
        },
      },
      select: {
        id: true,
        image: true,
        fullname: true,
        username: true,
      },
      take: 5,
      orderBy: {
        createAt: "desc",
      },
    });

    res.status(200).json({
      message: "5 user yang belum di follow",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server down",
    });
  }
};
