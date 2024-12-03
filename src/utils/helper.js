const base64UrlToBase64 = (base64Url) => {
    return base64Url.replace(/-/g, '+').replace(/_/g, '/');
  };
  
const parseJwt = (token) => {
    if (!token) return null;
  
    const parts = token.split('.');
    if (parts.length !== 3) return null;
  
    try {
      const payload = parts[1];
      const decoded = atob(base64UrlToBase64(payload));
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Failed to decode JWT', e);
      return null;
    }
  };
  
export const isTokenExpired = (token) => {
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return true;
    const currentTime = Date.now() / 1000; 
    return decoded.exp < currentTime;
};

export function getClassName(id_state){
  // console.log(id_state,'id_stateid_stateid_state')
    switch(id_state) {
      case 1:
          return 'greenColor';
      case 2:
          return 'yellowColor';
      case 3:
          return 'redColor';
      case 4:
            return 'buleColor';
      default:
          return ''; 
  }
}
