import React, { useState } from "react";

import compose from "lodash/fp/compose";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
} from "next-firebase-auth";

import { withNotifications } from "../components/withNotifications";
import { GeolocationContext } from "../components/GeolocationProvider";
import { Textarea, TextInput, Button, ColorInput } from "@mantine/core";
import { Todo } from "../types";
import { useCollection } from "@nandorojo/swr-firestore";


const Harmonogram = React.memo(( ) => {
  const user = useAuthUser();
  const { geolocation, setGeolocation } = React.useContext(GeolocationContext);

   const { data, add } = useCollection<Todo, any>(
    user.id ? "todos" : null,
    {
      where: ["userId", "==", user.id],
    },
  );
  
  const [todo,setTodo]=useState({
    title: "",
    content: "",
    status:"idk",
    colour:"#e64980"
  })

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
    <ColorInput
      format="hex"
      value={todo.colour}
      swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
      onChange={(color)=>{setTodo({...todo,colour:color})}}
    />
    <Button fullWidth onClick={async()=> await  add({
      userId: user.id!,
      title: todo.title,
      geolocation: geolocation,
      content: todo.content,
      status:"dik",
      colour: todo.colour
    })}>add task</Button>
    <ol>
        {data?.map((todo, index) => (
          <li key={index}><h5>{todo.title}</h5>{todo.content}</li>
        ))}
      </ol>
  </>);
});

export default compose(
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withNotifications
)(Harmonogram);


