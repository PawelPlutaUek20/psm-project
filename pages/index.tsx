import React from "react";
import Link from "next/link";

import compose from "lodash/fp/compose";
import { useCollection } from "@nandorojo/swr-firestore";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";

import { withNotifications } from "../components/withNotifications";
import { GeolocationContext } from "../components/GeolocationProvider";
import { Todo } from "../types";

import { Text, Grid, SimpleGrid, Badge, Checkbox } from "@mantine/core";

const Home: React.FC = () => {
  const user = useAuthUser();
  const { geolocation, setGeolocation } = React.useContext(GeolocationContext);

  const { data, add } = useCollection<Todo>(user.id ? "todos" : null, {
    where: ["userId", "==", user.id],
  });

  const task = data?.length === 1 ? "task" :"tasks";

  const todos = data?.map(todo=> {
    <tr><td>{todo.title}</td></tr>
  });
  

  <>
  <button onClick={() => alert(JSON.stringify(geolocation))}>
    my location
  </button>
  <button onClick={() => user.signOut()}>sign out</button>
  <Link href="/map" passHref>
    <a>
      <button>Map</button>
    </a>
  </Link>

  <button
    onClick={() =>
      setGeolocation({
        latitude: 50.0686,
        longitude: 19.9551,
      })
    }
  >
    get notified
  </button>
  <ol>
    {data?.map((todo, key) => (
      <li key={key}>{todo.title}</li>
    ))}
  </ol>
  
</>
  return (
    <Grid>
      <Grid.Col 
      span={12}
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop:30,
      marginBottom: 10
    }}>
      <Text weight={600} size="xl">You have {data?.length} {task} this month</Text>
 </Grid.Col>
 <Grid.Col 
      span={12}
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10
    }}>
   <input type="search" placeholder="Search for tasks.." style={{
     backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vector_search_icon.svg/800px-Vector_search_icon.svg.png",
     backgroundSize: "15px 15px",
     backgroundPosition: "10px 12px",
     backgroundRepeat: "no-repeat",
     width:"80%",
     padding: "12px 20px 12px 40px",
     border: "5px solid #ddd",
   }}/>
   
 </Grid.Col>
 <Grid.Col 
      span={12}
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    }}>

    <SimpleGrid cols={3} spacing="lg">
      <div><Checkbox/>TO-DO</div>
      <div><Checkbox/>Progress</div>
      <div><Checkbox/>Done</div>
    </SimpleGrid>

 </Grid.Col>
 <Grid.Col 
      span={12}
    style={{
      display: "flex",
      justifyContent: "left",
      alignItems: "left",
      marginLeft:"10%",
      marginTop:30,
      marginBottom: 10
    }}>
      <Text weight={600} size="xl">Today&apos;s Tasks</Text>
 </Grid.Col>
 <Grid.Col>
   <table>

   </table>
   
 </Grid.Col>
    </Grid>

  );
};

export default compose(
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withNotifications
)(Home);
