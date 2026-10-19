export function isTokenValid(token: string | null): boolean {
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    try {
      let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const payload = JSON.parse(atob(b64));
      if (!payload.exp) return true;
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }