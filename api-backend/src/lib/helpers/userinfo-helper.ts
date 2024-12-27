import axios from "axios";
import {
  ClientInfo,
  GeolocationData,
  Request,
} from "../../types/user-info.types";

export async function getClientAnalytics(req: Request): Promise<ClientInfo> {
  const userAgent = req.headers["user-agent"] || "Unknown";
  const ip = getIpAddress(req);

  const clientInfo: ClientInfo = {
    ip,
    geolocation: await getGeolocation(ip),
    userAgent: {
      raw: userAgent,
      browser: getBrowserInfo(userAgent),
      os: getOSInfo(userAgent),
      device: getDeviceInfo(userAgent),
    },
    acceptLanguage: req.headers["accept-language"] || "Unknown",
    method: req.method,
    path: req.path,
    protocol: req.protocol,
    referrer: req.headers["referer"] || req.headers["referrer"] || null,
    connection: {
      secure: req.secure,
      host: req.headers.host || "Unknown",
      port: req.connection.localPort,
    },
    timestamp: new Date().toISOString(),
  };

  return clientInfo;
}

const getIpAddress = (req: Request): string => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.headers["x-real-ip"] ||
    req.ip ||
    req.connection.remoteAddress ||
    "unknown"
  );
};

const getBrowserInfo = (userAgent: string) => {
  const browsers = [
    { name: "Chrome", pattern: /Chrome\/(\d+\.\d+)/ },
    { name: "Firefox", pattern: /Firefox\/(\d+\.\d+)/ },
    { name: "Safari", pattern: /Version\/(\d+\.\d+).*Safari/ },
    { name: "Edge", pattern: /Edg\/(\d+\.\d+)/ },
    { name: "IE", pattern: /MSIE (\d+\.\d+)/ },
  ];

  for (const browser of browsers) {
    const match = userAgent.match(browser.pattern);
    if (match) {
      return {
        name: browser.name,
        version: match[1],
      };
    }
  }
  return { name: "Unknown", version: "Unknown" };
};

const getOSInfo = (userAgent: string) => {
  const os = [
    { name: "Windows", pattern: /Windows NT (\d+\.\d+)/ },
    { name: "Mac", pattern: /Mac OS X (\d+[._]\d+)/ },
    { name: "Linux", pattern: /Linux/ },
    { name: "iOS", pattern: /iPhone OS (\d+)/ },
    { name: "Android", pattern: /Android (\d+\.\d+)/ },
  ];

  for (const system of os) {
    const match = userAgent.match(system.pattern);
    if (match) {
      return {
        name: system.name,
        version: match[1]?.replace("_", ".") || "Unknown",
      };
    }
  }
  return { name: "Unknown", version: "Unknown" };
};

const getDeviceInfo = (userAgent: string): "mobile" | "tablet" | "desktop" => {
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);

  if (isTablet) return "tablet";
  if (isMobile) return "mobile";
  return "desktop";
};

const getGeolocation = async (ip: string): Promise<GeolocationData | null> => {
  if (
    ip === "127.0.0.1" ||
    ip === "localhost" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.")
  ) {
    return {
      status: "skip",
      message: "Local IP address",
    };
  }

  try {
    const response = await axios.get<GeolocationData>(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as`
    );
    return response.data;
  } catch (error) {
    console.error("Geolocation error:", error);
    return null;
  }
};
