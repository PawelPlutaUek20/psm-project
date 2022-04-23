export type Geolocation = {
  latitude: number;
  longitude: number;
};

export type Todo = {
  title: string;
  userId: string;
  geolocation: Geolocation;
  content: string;
  status: string;
  color:string;
};

