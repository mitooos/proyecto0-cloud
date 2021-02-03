import "../styles/globals.css";
import { Typography } from "@material-ui/core";
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Typography variant="h2">Eventos</Typography>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
