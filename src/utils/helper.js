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
    if (!decoded || !decoded.exp) return false;
    const currentTime = Date.now() / 1000; 
    return decoded.exp < currentTime;
};

export function getClassName(id_state){
  // console.log(id_state,'id_stateid_stateid_state')
    switch(id_state) {
      case 1:
          return 'buleColor';
      case 2:
          return 'greenColor';
      case 3:
          return ' yellowColor';
      case 4:
            return 'redColor';
      default:
          return ''; 
  }
}



export function getClassColorCode(id_state){
  // console.log(id_state,'id_stateid_stateid_state')
    switch(id_state) {
      case 2:
          return '#22b735';
      case 3:
          return '#ecad42';
      case 4:
          return '#ff0000';
      case 5:
            return '#009fff';
      default:
          return ''; 
  }
}

export function getStatusColorCode(id_state){
  
  switch(id_state) {
    case "#E23115":
        return 'priorita alta';
    case "#F9AB26":
        return 'priorita medio';
    case "#22B735":
        return 'priorita baso';
    default:
        return ''; 
}
}

export function getPageId(key){
  const pages = localStorage.getItem("navPages")
  const page = pages.find(p => p.page_name_label === key);
    return page ? page.parent_page_id : null; 
}