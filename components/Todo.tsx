import React from "react";

import { MapPin, Clock } from "tabler-icons-react";
import { Card, Divider, Text } from "@mantine/core";

import { Todo } from "../types";
import { useDocument } from "@nandorojo/swr-firestore";
import { TodoModal } from "./TodoModal";

type Props = {
  todo: Todo;
};

export const TodoComponent: React.FC<Props> = React.memo(({ todo }) => {
  const [opened, setOpened] = React.useState(false);

  const { update } = useDocument<Todo>(`todos/${todo.id}`);

  return (
    <>
      <Card
        onClick={() => setOpened(true)}
        sx={{ backgroundColor: todo.color }}
        withBorder
        p="md"
        radius="lg"
        mb="md"
      >
        <Text weight={600} mb={4}>
          {todo.title}
        </Text>

        <Text color="gray" mb={4}>
          {todo.description}
        </Text>
        <div
          style={{
            display: "flex",
            gap: 4,
            alignItems: "flex-start",
            marginTop: 8,
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <MapPin color="blue" />
          </div>
          <Text color="blue">{todo.locationName}</Text>
        </div>
        <Divider color="gray" my="sm" />
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Clock width={20} height={20} />
          <Text>
            {new Date(todo.start.seconds * 1000).toDateString()} -{" "}
            {new Date(todo.end.seconds * 1000).toDateString()}
          </Text>
        </div>
      </Card>
      <TodoModal
        opened={{ get: opened, set: setOpened }}
        todo={todo}
        action={update}
        actionText="Edit"
      />
    </>
  );
});
