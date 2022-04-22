import type { NextApiRequest, NextApiResponse } from "next";
import { verifyIdToken } from "next-firebase-auth";

import db from "../../firebase/firestore/initFirestore";
import { Todo } from "../../types";

export const getUserTodos = async (userId: string) => {
  const todos = await db
    .collection("todos")
    .where("userId", "==", userId)
    .get();
  return todos.docs.map((todo) => todo.data());
};

export const addTodo = async (todo: Todo) => {
  return await db.collection("todos").add(todo);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  try {
    if (req.method === "POST") {
      if (
        "userId" in body &&
        typeof body.userId === "string" &&
        "title" in body &&
        typeof body.title === "string"
      ) {
        await addTodo({ ...body });
        return res.status(200).end();
      }
    } else if (req.method === "GET") {
      if (req.headers.authorization) {
        const { id: userId } = await verifyIdToken(req.headers.authorization);
        const userTodos = await getUserTodos(userId!);
        return res.status(200).json(userTodos);
      }
    }
    throw new Error();
  } catch (e) {
    return res.status(400).end();
  }
}
