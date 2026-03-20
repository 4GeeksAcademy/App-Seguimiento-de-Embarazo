export const initialStore = () => {
  return {
    message: null,
    // 1. AÑADIDO: Inicializamos el token buscándolo en el localStorage
    token: localStorage.getItem("token") || null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo,
        ),
      };

    // 2. AÑADIDO: Caso para cuando el usuario hace Login
    case "set_token":
      return {
        ...store,
        token: action.payload,
      };

    // 3. AÑADIDO: Caso para cuando el usuario hace Logout
    case "logout":
      return {
        ...store,
        token: null,
      };

    default:
      throw Error("Unknown action.");
  }
}
