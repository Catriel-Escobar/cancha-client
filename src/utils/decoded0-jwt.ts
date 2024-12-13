export function decodedJwt(token: string) {
  try {
    // Dividir el token en sus partes
    const [header, payload, signature] = token.split('.');

    // Decodificar la parte del payload (base64)
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
