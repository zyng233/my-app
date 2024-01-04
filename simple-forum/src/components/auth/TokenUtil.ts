import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  exp?: number;
}

export const checkTokenExpiration = (token: string | null): boolean => {
  if (token) {
    try {
      const decodedToken = jwt.decode(token, {
        complete: true,
      }) as DecodedToken;

      if (decodedToken && decodedToken.exp) {
        const expirationTime = decodedToken.exp;
        const currentTime = Math.floor(Date.now() / 1000);

        return expirationTime > currentTime; // Return true if the token is still valid
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return false; // Return false if there's an issue or the token is not found
};
