let id = 0;

class AsyncLock {
  static instance: AsyncLock;

  static getInstance(): AsyncLock {
    if (!this.instance) {
      this.instance = new AsyncLock();
    }
    return this.instance;
  }

  private promise: Promise<void> | null = null;
  private resolve: (() => void) | null = null;

  async acquire(): Promise<void> {
    id++;
    while (this.promise) {
      await this.promise;
    }
    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
    console.log("1", this.promise);
  }

  release(): void {
    console.log("2", this.promise);
    if (this.resolve) {
      this.resolve();
      console.log("3", this.promise);
      this.clear();
    }
  }

  private clear(): void {
    this.promise = null;
    this.resolve = null;
  }
}

const asyncLock = AsyncLock.getInstance();

export default asyncLock;
