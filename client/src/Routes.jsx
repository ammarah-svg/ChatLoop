import RegisterAndLoginForm from "./RegisterAndLoginForm.jsx";
import {useContext} from "react";
import {UserContext} from "./UserContext.jsx";
import Chat from "./Chat.jsx";

export default function Routes() {
  const {username,email, id} = useContext(UserContext);
console.log(email,id,username)
  if (id) {
    return <Chat />;
  }

  return (
    <RegisterAndLoginForm />
  );
}