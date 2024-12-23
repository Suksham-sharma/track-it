import prismaClient from "./prismaClient";

export const fetchId = async () => {
  try {
    prismaClient.$transaction(async (tx) => {
      const ranges = await tx.range.findMany();

      const selectedRange = ranges[Math.floor(Math.random() * ranges.length)];
    });
  } catch (err) {}
};
