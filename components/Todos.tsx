import React from "react";
 
import { useCollection } from "@nandorojo/swr-firestore";
import { Todo } from "../types";

type Props = {
  userId: string | null;
};

export const Todos: React.FC<Props> = React.memo(({ userId }) => {
  const { data, add } = useCollection<Todo>(userId ? "todos" : null, {
    where: ["userId", "==", userId],
  });

  console.log(data)
  return (
    <>
      <button
        onClick={async () =>
          await add({
            title: (Math.random() + 1).toString(36).substring(7),
            userId: userId!,
          })
        }
      >
        add random todo
      </button>
      <ol>
        {data?.map((todo, key) => (
          <li key={key}>{todo.title}</li>
        ))}
      </ol>
      ;
    </>
  );
});
