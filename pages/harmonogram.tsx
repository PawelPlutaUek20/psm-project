import React from "react";

import compose from "lodash/fp/compose";
import { useCollection } from "@nandorojo/swr-firestore";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";

import { Button } from "@mantine/core";

import { withNotifications } from "../components/withNotifications";
import { TodoComponent } from "../components/Todo";
import { Todo } from "../types";
import { TodoModal } from "../components/TodoModal";

const Harmonogram = React.memo(() => {
  const user = useAuthUser();
  const [opened, setOpened] = React.useState(false);

  const { data, add } = useCollection<Todo>(user.id ? "todos" : null, {
    where: ["userId", "==", user.id],
  });

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpened(true)}
        sx={{ zIndex: 101, position: "absolute", top: 17, right: 17 }}
      >
        Add Task
      </Button>
      <TodoModal
        action={async (data) => {
          await add({ ...data, userId: user.id });
        }}
        actionText={"Add"}
        opened={{
          get: opened,
          set: setOpened,
        }}
      />
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
