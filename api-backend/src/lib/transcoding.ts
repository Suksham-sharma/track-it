export const randomString =
  "aZbYcXdWeVfUgThSiRjQkPlOmNnMoLpKqJrIsHtGuFvEwDxCyBzA0123456789";

export const encodeUrlIdToHash = (id: number) => {
  try {
    if (id === 0) return false;

    let hashArray = [];

    while (id > 0) {
      hashArray.push(randomString[id % 62]);
      id = Math.floor(id / 62);
    }
  } catch (error) {}
};

export const decodeHashToUrlId = (hash: string) => {
  try {
    let id = 0;
    let length = hash.length;

    for (let i = 0; i < length; i++) {
      id += randomString.indexOf(hash[i]) * Math.pow(62, length - i - 1);
    }

    return id;
  } catch (error) {}
};
