import fuego from "../../firebase/firestore/initFirestore";

export const getTodos = async (userId: string) => {
  const todos = await fuego.db
    .collection("todos")
    .where("userId", "==", userId)
    .get();

  return todos.docs.map((u) => u.data());
};
