export const initialStore = () => {
  return {
    user: null,
    token: localStorage.getItem("token") || null, // Recupera el token si refrescas la página
    embarazo: null,
    registros: []
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'login':
      return {
        ...store,
        user: action.payload.user,
        token: action.payload.token
      };

    case 'logout':
      localStorage.removeItem("token");
      return {
        ...store,
        user: null,
        token: null,
        embarazo: null
      };

    case 'set_embarazo':
      return {
        ...store,
        embarazo: action.payload
      };

    default:
      return store;
  }
}