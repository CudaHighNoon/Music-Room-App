import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { Typography, Button, Grid } from "@material-ui/core";

import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import Info from "./Info";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  async componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ roomCode: data.code });
      });
  }

  clearRoomCode() {
    this.setState({ roomCode: null });
  }

  renderHomePage() {
    return (
      <>
        <style>
          {`
            @keyframes slideInLeft {
              0% {
                transform: translateX(-50px);
                opacity: 0;
              }
              100% {
                transform: translateX(0);
                opacity: 1;
              }
            }

            @keyframes slideInRight {
              0% {
                transform: translateX(50px);
                opacity: 0;
              }
              100% {
                transform: translateX(0);
                opacity: 1;
              }
            }

            .nav-link:hover {
              color: #bbb;
              transition: color 0.2s ease-out;
            }

            /* Media query for smaller screens */
            @media (max-width: 768px) {
              .textSide, .imageSide {
                animation: none; /* Disable animations on small screens for performance */
              }
              .textSide {
                max-width: 90%;
                margin-bottom: 2rem;
              }
              .mainTitle {
                font-size: 2.5rem;
              }
              .description {
                font-size: 1rem;
              }
              .laptopImage {
                width: 90%;
              }
              .circleImage {
                width: 200px;
                left: -100px;
              }
              .heroContainer {
                flex-direction: column;
                align-items: center;
              }
              .imageSide {
                margin-left: 0;
                margin-bottom: 2rem;
              }
            }
          `}
        </style>

        <Grid container style={styles.pageWrapper}>
          {/* NAVBAR */}
          <Grid item xs={12} style={styles.navbar}>
            <Grid container alignItems="center" style={styles.navItems}>
              <img
                src="../../static/images/logo.png"
                alt="TuneShare Logo"
                style={styles.logoImage}
              />
              <Typography variant="h5" style={styles.navBrand}>
                TuneShare
              </Typography>
              <Link to="/" className="nav-link" style={styles.navLink}>
                Home
              </Link>
              <Link to="/info" className="nav-link" style={styles.navLink}>
                About
              </Link>
            </Grid>
          </Grid>

          {/* HERO SECTION */}
          <Grid
            container
            item
            xs={12}
            style={styles.heroContainer}
            className="heroContainer"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* LEFT TEXT SIDE */}
            <Grid
              item
              xs={12}
              md={6}
              style={styles.textSide}
              className="textSide"
            >
              <Typography variant="body2" style={styles.tagline}>
                Share your Music with Others
              </Typography>

              <Typography variant="h2" style={styles.mainTitle} className="mainTitle">
                TuneShare
              </Typography>

              <Typography variant="body1" style={styles.description} className="description">
                TuneShare enables Spotify Premium users to host a Music Room in which
                all participants can listen to the same songs together.
              </Typography>

              {/* Buttons in a vertical stack */}
              <Grid container direction="column" spacing={2} style={styles.buttonColumn}>
                <Grid item>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/create"
                    style={styles.createButton}
                  >
                    Create Room
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/join"
                    style={styles.joinButton}
                  >
                    Join Room
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* RIGHT IMAGE SIDE */}
            <Grid
              item
              xs={12}
              md={6}
              style={styles.imageSide}
              className="imageSide"
            >
              <img
                src="../../static/images/circle.png"
                alt="Colorful Circle"
                style={styles.circleImage}
              />
              <img
                src="../../static/images/laptop.png"
                alt="Laptop"
                style={styles.laptopImage}
                className="laptopImage"
              />
            </Grid>
          </Grid>

          {/* BOTTOM-LEFT CIRCLE */}
          <img
            src="../../static/images/circle.png"
            alt="Bottom Circle"
            style={styles.bottomCircle}
          />
        </Grid>
      </>
    );
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() =>
              this.state.roomCode ? (
                <Redirect to={`/room/${this.state.roomCode}`} />
              ) : (
                this.renderHomePage()
              )
            }
          />
          <Route path="/join" component={RoomJoinPage} />
          <Route path="/info" component={Info} />
          <Route path="/create" component={CreateRoomPage} />
          <Route
            path="/room/:roomCode"
            render={(props) => (
              <Room {...props} leaveRoomCallback={this.clearRoomCode} />
            )}
          />
        </Switch>
      </Router>
    );
  }
}

const styles = {
  pageWrapper: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    flexDirection: "column",
    fontFamily: "Nunito, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  navbar: {
    display: "flex",
    padding: "1rem 2%",
  },
  navItems: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  logoImage: {
    width: "8vw", // relative size
    maxWidth: "100px",
    marginRight: "0.5rem",
  },
  navBrand: {
    fontWeight: "bold",
    color: "#fff",
    marginRight: "2rem",
    fontSize: "1.8rem",
    textDecoration: "none",
  },
  navLink: {
    marginLeft: "1.5rem",
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: 600,
  },
  heroContainer: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: "3rem 5%",
    boxSizing: "border-box",
    height: "30%",
  },
  textSide: {
    maxWidth: "550px",
    marginBottom: "2rem", // reduced bottom margin for flexibility
    animation: "slideInLeft 1s ease-out forwards",
  },
  tagline: {
    fontSize: "1.4rem",
    color: "#ccc",
    marginBottom: "0.8rem",
  },
  mainTitle: {
    fontWeight: "bold",
    marginBottom: "1.8rem",
    fontSize: "3.4rem",
  },
  description: {
    marginBottom: "3rem",
    fontSize: "1.4rem",
    lineHeight: 1.6,
  },
  buttonColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  createButton: {
    background: "linear-gradient(to right, #3B82F6, #6366F1)",
    color: "#fff",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    padding: "0.75rem 1.5rem",
    textTransform: "none",
    boxShadow: "none",
    width: "100%",
  },
  joinButton: {
    background: "linear-gradient(to right, #ec4899, #f43f5e)",
    color: "#fff",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    padding: "0.75rem 1.5rem",
    textTransform: "none",
    boxShadow: "none",
    width: "100%",
  },
  imageSide: {
    position: "relative",
    minWidth: "300px",
    marginBottom: "2rem",
    textAlign: "center",
    flexShrink: 0,
    animation: "slideInRight 1s ease-out forwards",
  },
  circleImage: {
    position: "absolute",
    width: "25vw",
    maxWidth: "450px",
    left: "-140px",
    top: "0px",
    zIndex: 1,
  },
  laptopImage: {
    position: "relative",
    zIndex: 2,
    width: "60vw",
    maxWidth: "700px",
  },
  bottomCircle: {
    position: "absolute",
    left: "-100px",
    bottom: "-50px",
    width: "300px",
    zIndex: 0,
    opacity: 0.9,
  },
};
