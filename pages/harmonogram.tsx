import React from "react";
import compose from "lodash/fp/compose";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";

import { withNotifications } from "../components/withNotifications";
import { Button } from "@mantine/core";
import { Todo } from "../types";
import { useCollection } from "@nandorojo/swr-firestore";
import { TodoComponent } from "../components/Todo";

const Harmonogram = React.memo(() => {
  const user = useAuthUser();

  const { data, add } = useCollection<Todo>(user.id ? "todos" : null, {
    where: ["userId", "==", user.id],
  });

  return (
    <>
      <Button
        size="sm"
        // onClick={async () =>
        //   await add({
        //     userId: user.id!,
        //     title: todo.title,
        //     geolocation: JSON.stringify(markerPosition),
        //     content: todo.content,
        //     status: "dik",
        //     colour: todo.colour,
        //   })
        // }
        sx={{ zIndex: 101, position: "absolute", top: 17, right: 17 }}
      >
        Add Task
      </Button>
      {data?.map((todo, index) => (
        <TodoComponent key={index} todo={todo} />
      ))}
    </>
  );
});

export default compose(
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withNotifications
)(Harmonogram);
