import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { dataProvider } from "../client/src/dataProvider";
import { authProvider } from "../client/src/authProvider";

export const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}></Admin>
);
