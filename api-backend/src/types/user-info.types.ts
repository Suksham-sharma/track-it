interface UserAgentInfo {
  raw: string;
  browser: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
  device: "mobile" | "tablet" | "desktop";
}

interface ConnectionInfo {
  secure: boolean;
  host: string;
  port: number;
}

export interface GeolocationData {
  status: string;
  continent?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  message?: string;
}

export interface ClientInfo {
  ip: string;
  geolocation: GeolocationData | null;
  userAgent: UserAgentInfo;
  acceptLanguage: string;
  method: string;
  path: string;
  protocol: string;
  referrer: string | null;
  connection: ConnectionInfo;
  timestamp: string;
}

export interface Request {
  headers: {
    [key: string]: string | undefined;
    "user-agent"?: string;
    "accept-language"?: string;
    "x-forwarded-for"?: string;
    "x-real-ip"?: string;
    referer?: string;
    referrer?: string;
    "sec-ch-viewport-width"?: string;
    "sec-ch-viewport-height"?: string;
    host?: string;
  };
  ip?: string;
  connection: {
    remoteAddress?: string;
    localPort: number;
  };
  method: string;
  path: string;
  protocol: string;
  secure: boolean;
}
