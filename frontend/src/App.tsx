import {
  Box,
  Container,
  CssBaseline,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";
import Copyright from "./components/Copyright";
import SignatureLoader from "./components/SignatureDetection/SignatureLoader";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
    paddingLeft: 20,
    paddingTop: 6,
    paddingBottom: 7,
  },
  content: {
    flexGrow: 1,
    height: "100vh",
  },
  container: {
    paddingBottom: theme.spacing(4),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Box component="main" m={1} className={classes.content}>
        <Box component="div" className={classes.title}>
          <Typography component="h3" variant="h4" color="inherit" noWrap>
            Signature detection
          </Typography>
        </Box>
        <Container maxWidth="xl" className={classes.container}>
          <SignatureLoader />
          <Box pt={10}>
            <Copyright />
          </Box>
        </Container>
      </Box>
    </div>
  );
}

export default App;
