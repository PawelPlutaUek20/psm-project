import React, { useState } from "react";

import compose from "lodash/fp/compose";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";

import { withNotifications } from "../components/withNotifications";
import { GeolocationContext } from "../components/GeolocationProvider";
import { Textarea, TextInput, Button } from "@mantine/core";
import { getUserTodos } from "./api/todos";
import { Todo } from "../types";
import router from "next/router";
type Props = {
  todos: Todo[];
};
function refreshData(): any {
  router.replace(router.asPath);
}
const Harmonogram = React.memo<Props>(({todos} ) => {
  const user = useAuthUser();
  const geolocation = React.useContext(GeolocationContext);
  
  const [todo,setTodo]=useState({
    title: "",
    content: "",
    status:"idk"
  })

  const addtask=()=>{
    console.log('todo treract',todo)
    console.log('todo treract',todo.title)

    fetch("api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        title: todo.title,
        geolocation: geolocation,
        content: todo.content
      }),
    }).then(() => refreshData())

  }

  return (
  <>
  <TextInput
   placeholder="Title"
   label="Task title"
   radius="lg"
   value={todo.title}
   onChange={(event)=>setTodo({...todo,title:event.currentTarget.value})}
  ></TextInput>
   <Textarea
      placeholder=" Task description"
      label="Task description"
      radius="lg"
      size="md"
      value={todo.content}
      onChange={(event)=>setTodo({...todo,content:event.currentTarget.value})}
    />
    <Button fullWidth onClick={addtask}>add task</Button>
    <ol>
        {todos.map((todo, index) => (
          <li key={index}><h5>{todo.title}</h5>{todo.content}</li>
        ))}
      </ol>
  </>);
});

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const todos = AuthUser.id && (await getUserTodos(AuthUser.id));
  return {
    props: {
      todos,
    },
  };
});

export default compose(
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withNotifications
)(Harmonogram);


