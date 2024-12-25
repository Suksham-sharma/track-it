import { PrismaClient } from "@prisma/client";
import asyncLock from "./asyncLock";

const CONFIG = {
  RANGE_SIZE: 5,
  MAX_ACTIVE_RANGES: 4,
  DEFAULT_START_VALUE: 1000,
} as const;

type RangeStatus = "LIVE" | "EXHAUSTED";

interface UrlRange {
  id: number;
  start: number;
  end: number;
  current: number;
  status: RangeStatus;
}

class UrlRangeManager {
  constructor(private readonly prisma: PrismaClient) {}

  public async fetchId(): Promise<number | null> {
    await asyncLock.acquire();
    console.log("after acquire");
    try {
      return await this.prisma.$transaction(async (tx) => {
        const existingRanges = await this.fetchExistingRanges(tx);

        const urlRanges = await this.createMissingRanges(tx, existingRanges);

        if (urlRanges.length === 0) {
          throw new Error("No valid URL range available after creation.");
        }

        const updatedRange = await this.updateSelectedRange(tx, urlRanges);
        console.log("returing from func");
        return updatedRange.current;
      });
    } catch (error) {
      console.error(
        "Error fetching ID:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return null;
    } finally {
      console.log("before release");
      asyncLock.release();
      console.log("after release");
    }
  }

  private async fetchExistingRanges(tx: any) {
    return tx.urlRange.findMany({
      where: { status: "LIVE" },
    });
  }

  private async createMissingRanges(
    tx: any,
    existingRanges: UrlRange[]
  ): Promise<UrlRange[]> {
    const missingRangesCount = CONFIG.MAX_ACTIVE_RANGES - existingRanges.length;

    if (missingRangesCount <= 0) return existingRanges;

    try {
      // console.log(`Creating ${missingRangesCount} new ranges`);

      const currentMaxEnd = await this.getMaxEndValue(tx);
      const newRanges = await this.generateNewRanges(
        tx,
        currentMaxEnd,
        missingRangesCount
      );

      // console.log(`New ranges created: ${newRanges.length}`);
      return [...existingRanges, ...newRanges];
    } catch (error) {
      console.error(
        "Error creating missing ranges:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return existingRanges;
    }
  }

  private async generateNewRanges(
    tx: any,
    currentMaxEnd: number,
    count: number
  ): Promise<UrlRange[]> {
    const newRanges: UrlRange[] = [];

    for (let i = 0; i < count; i++) {
      const start = currentMaxEnd + 1 + i * CONFIG.RANGE_SIZE;
      const newRange = await tx.urlRange.create({
        data: {
          start,
          end: start + CONFIG.RANGE_SIZE - 1,
          current: start,
          status: "LIVE",
        },
      });
      newRanges.push(newRange);
    }

    return newRanges;
  }

  private async getMaxEndValue(tx: any): Promise<number> {
    const lastRange = await tx.urlRange.findFirst({
      orderBy: { end: "desc" },
    });
    return lastRange?.end ?? CONFIG.DEFAULT_START_VALUE;
  }

  private selectRandomRange(ranges: UrlRange[]): UrlRange | null {
    if (ranges.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * ranges.length);
    return ranges[randomIndex];
  }

  private async updateSelectedRange(
    tx: any,
    ranges: UrlRange[]
  ): Promise<UrlRange> {
    const selectedRange = this.selectRandomRange(ranges);
    if (!selectedRange) {
      throw new Error("No valid URL range available.");
    }

    const updatedRange = await tx.urlRange.update({
      where: { id: selectedRange.id },
      data: { current: { increment: 1 } },
    });

    if (updatedRange.current >= updatedRange.end) {
      await tx.urlRange.update({
        where: { id: selectedRange.id },
        data: { status: "EXHAUSTED" },
      });
    }

    return updatedRange;
  }
}

const urlRangeManager = new UrlRangeManager(new PrismaClient());
export default urlRangeManager;
