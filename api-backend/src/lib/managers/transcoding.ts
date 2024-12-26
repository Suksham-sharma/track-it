class TranscodingManager {
  private static instance: TranscodingManager;

  private readonly RANDOM_STRING =
    "aZbYcXdWeVfUgThSiRjQkPlOmNnMoLpKqJrIsHtGuFvEwDxCyBzA0123456789";
  private readonly BASE = this.RANDOM_STRING.length;

  private constructor() {}

  public static getInstance(): TranscodingManager {
    if (!TranscodingManager.instance) {
      TranscodingManager.instance = new TranscodingManager();
    }
    return TranscodingManager.instance;
  }

  public encodeUrlIdToHash(id: number): string | null {
    if (id <= 0) return null;

    let hash = "";

    try {
      while (id > 0) {
        const remainder = id % this.BASE;
        hash = this.RANDOM_STRING[remainder] + hash;
        id = Math.floor(id / this.BASE);
      }
    } catch (error: unknown) {
      console.log(`Error encoding ID: ${error}`);
      return null;
    }

    return hash;
  }

  public decodeHashToUrlId(hash: string): number | null {
    if (!hash || typeof hash !== "string") return null;

    let id = 0;

    try {
      for (let i = 0; i < hash.length; i++) {
        const charIndex = this.RANDOM_STRING.indexOf(hash[i]);
        if (charIndex === -1) throw new Error(`Invalid character: ${hash[i]}`);
        id = id * this.BASE + charIndex;
      }
    } catch (error) {
      console.log(`Error decoding hash: ${error}`);
      return null;
    }

    return id;
  }
}

const transcoder = TranscodingManager.getInstance();

export default transcoder;
