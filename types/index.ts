export type Geolocation = {
  latitude: number;
  longitude: number;
};

export type Todo = {
  title: string;
  userId: string;
  geolocation: Geolocation;
  description: string;
  locationName: string;
  color: string;
  start: {
    seconds: number;
    nanoseconds: 0;
  };
  end: {
    seconds: number;
    nanoseconds: 0;
  };
};
