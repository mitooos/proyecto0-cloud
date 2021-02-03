import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useState } from "react";
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';

const AuthForm = (props) => {
  const [authInfo, setAuthInfo] = useState({
    email: "",
    password: "",
  });

  const handleEmailChange = (event) => {
    setAuthInfo({ ...authInfo, email: event.target.value });
  };
  const handlePasswordChange = (event) => {
    setAuthInfo({ ...authInfo, password: event.target.value });
  };
  const action = () => {
    props.action(authInfo);
  };

  return (
    <div>
      <Typography variant="h3">{props.title}</Typography>
      <form>
        <div>
          <TextField id="email" label="Email" onChange={handleEmailChange} />
        </div>
        <div>
          <FormControl>
            <Input
              type="password"
              id="password"
              label="Password"
              placeholder="contrasena"
              onChange={handlePasswordChange}
          />
          </FormControl>
                  </div>
      </form>
      <Button variant="contained" color="primary" onClick={action}>
        {props.title}
      </Button>
    </div>
  );
};

export default AuthForm;
