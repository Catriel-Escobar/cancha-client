export interface DecodedJwt {
  id: string;
  unique_name: string;
  name: string;
  role: string;
  exp: number;
  exp_milliseconds: number;
  iat: number;
  nbf: number;
}

export function decodedJwt(token: string): DecodedJwt | null {
  try {
    const [header, payload, signature] = token.split('.');
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const parsedPayload = JSON.parse(decodedPayload) as DecodedJwt;
    parsedPayload.exp_milliseconds =
      (parsedPayload.exp - Math.floor(Date.now() / 1000)) * 1000;
    return parsedPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
