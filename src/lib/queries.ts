"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import db from "./db";
import { subDays, startOfWeek, startOfMonth, startOfYear } from "date-fns";
import { User } from "@prisma/client";

export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return userData;
};

export const initOrUpdateUserData = async (data: Partial<User>) => {
  if (!data.email) return null;
  const user = await currentUser();
  if (!user) return null;

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: { name: user.fullName },
    create: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.fullName,
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      role: "USER",
    },
  });

  return userData;
};

export const getChats = async (userId: string) => {
  const chats = await db.chat.findMany({
    where: {
      userId: userId,
    },
  });

  return chats;
};

export const saveChat = async (
  userId: string,
  message: string,
  sender: "ai" | "user"
) => {
  const chat = await db.chat.create({
    data: {
      userId: userId,
      sender: sender,
      message: message,
    },
  });

  return chat;
};

export const getActiveChannels = async (userId: string) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  //fetch channels
  const allChannels = await db.channels.findMany();
  let channels = [];
  for (let channel of allChannels) {
    if (channel.userId !== userId) {
      channels.push(channel);
    }
  }
  return channels;
};

export const getUsersActiveChannels = async (userId: string) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  //fetch channels
  const allChannels = await db.channels.findMany();
  let channels = [];
  for (let channel of allChannels) {
    if (channel.userId === userId) {
      channels.push(channel);
    }
  }
  return channels;
};

export const createChannel = async (userId: string, channelName: string) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  // check if user already has a channel
  // const existingChannel = db.channels.findFirst({
  //   where: {
  //     userId: userId,
  //   },
  // });

  // if (existingChannel !== null) {
  //   return existingChannel;
  // }

  // create channel
  const channel = await db.channels.create({
    data: {
      name: channelName,
      userId: userId,
    },
  });

  return channel;
};

export const submitReviewForChannel = async (
  channelId: string,
  reviewerId: string,
  stars: number,
  review: string
) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const channel = await db.channels.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    return null;
  }

  const channelOwnerId = channel.userId;

  if (channelOwnerId === reviewerId) {
    return null;
  }

  const owner = await db.user.findUnique({
    where: {
      id: channelOwnerId,
    },
  });

  if (!owner || owner.id === user.id) {
    return null;
  }

  const newReviewRating = owner.reviewRating
    ? owner.reviewRating + stars
    : stars;

  const updatedUser = await db.user.update({
    where: {
      id: channelOwnerId,
    },
    data: {
      reviewRating: newReviewRating,
    },
  });

  const createdReview = await db.review.create({
    data: {
      rating: stars,
      comment: review,
      userId: owner.id,
    },
  });

  return updatedUser;
};

export const getRewards = async (userId: string) => {
  const user = await currentUser();
  if (!user) {
    return {
      weeklyRewards: 0,
      monthlyRewards: 0,
      yearlyRewards: 0,
    };
  }

  const rewards = await db.review.findMany({
    where: {
      userId: userId,
    },
  });

  // Get current date
  const now = new Date();

  // Weekly reward - Aggregate total stars for reviews from the last 7 days
  const weeklyRewards = await db.review.aggregate({
    _sum: {
      rating: true, // Sum the ratings
    },
    where: {
      userId: userId,
      createdAt: {
        gte: subDays(now, 7), // Subtract 7 days from current date
      },
    },
  });

  // Monthly reward - Aggregate total stars for reviews from the current month
  const monthlyRewards = await db.review.aggregate({
    _sum: {
      rating: true, // Sum the ratings
    },
    where: {
      userId: userId,
      createdAt: {
        gte: startOfMonth(now), // Start of the current month
      },
    },
  });

  // Yearly reward - Aggregate total stars for reviews from the current year
  const yearlyRewards = await db.review.aggregate({
    _sum: {
      rating: true, // Sum the ratings
    },
    where: {
      userId: userId,
      createdAt: {
        gte: startOfYear(now), // Start of the current year
      },
    },
  });

  // Return the aggregated results as an object
  return {
    weeklyRewards: weeklyRewards._sum.rating || 0,
    monthlyRewards: monthlyRewards._sum.rating || 0,
    yearlyRewards: yearlyRewards._sum.rating || 0,
  };
};

export const getRewardsData = async (userId: string) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const rewardsData = await db.review.findMany({
    where: {
      userId: userId,
    },
    select: {
      rating: true,
      createdAt: true,
    },
  });

  // Format the data into the desired structure
  const userReviewData = rewardsData.reduce((acc, curr) => {
    const date = curr.createdAt.toISOString().split("T")[0]; // Extract "YYYY-MM-DD" from the timestamp
    const existing = acc.find((entry) => entry.date === date);
    if (existing) {
      existing.totalRating += curr.rating; // Add the rating to the existing date's total
      existing.reviewCount += 1; // Increment the review count
    } else {
      acc.push({ date, totalRating: curr.rating, reviewCount: 1 }); // Create a new entry
    }
    return acc;
  }, [] as { date: string; totalRating: number; reviewCount: number }[]);

  console.log(userReviewData);

  return userReviewData;
};
