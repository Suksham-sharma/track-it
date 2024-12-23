import prismaClient from "./prismaClient";

const RANGE_SIZE = 10_000;
const MAX_ACTIVE_RANGES = 4;

interface UrlRange {
  id: number;
  start: number;
  end: number;
  current: number;
  status: "LIVE" | "EXHAUSTED";
}

export class UrlRangeManager {
  private prisma;

  constructor(prismaClientInstance: typeof prismaClient) {
    this.prisma = prismaClientInstance;
  }

  public async fetchId(): Promise<number> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const urlRanges = await tx.urlRange.findMany({
          where: { status: "LIVE" },
          orderBy: { current: "asc" },
        });

        if (urlRanges.length < MAX_ACTIVE_RANGES) {
          await this.createMissingRanges(tx, urlRanges);
        }

        const selectedRange = this.selectRandomRange(urlRanges);
        if (!selectedRange) {
          throw new Error("No valid URL range available after creation.");
        }

        const updatedRange = await tx.urlRange.update({
          where: { id: selectedRange.id },
          data: { current: { increment: 1 } },
        });

        return updatedRange.current;
      });
    } catch (error) {
      console.error("Error fetching ID:", error);
      throw new Error("Failed to fetch a unique ID. Please try again later.");
    }
  }

  private async createMissingRanges(tx: any, existingRanges: UrlRange[]) {
    const activeRangeCount = existingRanges.length;
    const missingRangesCount = MAX_ACTIVE_RANGES - activeRangeCount;

    if (missingRangesCount <= 0) return;

    const currentMaxEnd = await this.getMaxEndValue(tx);

    for (let i = 0; i < missingRangesCount; i++) {
      const start = currentMaxEnd + 1 + i * RANGE_SIZE;
      await tx.urlRange.create({
        data: {
          start,
          end: start + RANGE_SIZE - 1,
          current: start,
          status: "LIVE",
        },
      });
    }
  }

  private async getMaxEndValue(tx: typeof prismaClient): Promise<number> {
    const lastRange = await tx.urlRange.findFirst({
      orderBy: { end: "desc" },
    });
    return lastRange?.end ?? 1000;
  }

  private selectRandomRange(ranges: UrlRange[]): UrlRange | null {
    if (ranges.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * ranges.length);
    return ranges[randomIndex];
  }
}
