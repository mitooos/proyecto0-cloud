import Container from "@material-ui/core/Container";
import axios from "axios";
import AuthForm from "../components/authForm";
import Cookies from "js-cookie";

export default function Home() {
  const signUp = async (values) => {
    const resp = await axios.post("http://172.24.98.148:8080/usuarios", values);
    Cookies.set("token", resp.data.token);
    window.location = "/eventos";
  };

  const signIn = async (values) => {
    console.log(values);
    const resp = await axios.post(
      "http://172.24.98.148:8080/auth/login",
      values
    );
    Cookies.set("token", resp.data.token);
    window.location = "/eventos";
  };

  return (
    <Container maxWidth="sm">
      <AuthForm action={signUp} title="Registrarse" />
      <AuthForm action={signIn} title="Ingresar" />
    </Container>
  );
}
