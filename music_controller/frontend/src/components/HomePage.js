import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { Typography, Button, Grid, Fade, Grow } from "@material-ui/core";

import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import Info from "./Info";
import Navbar from "./Navbar";


export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
      checked: false, // State to control animations
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  async componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ roomCode: data.code });
      });

    // Trigger animations after component mounts
    this.setState({ checked: true });
  }

  clearRoomCode() {
    this.setState({ roomCode: null });
  }

  renderHomePage() {
    return (
      <>
        <Grid container style={styles.pageWrapper}>
          {/* NAVBAR */}
          <Navbar />
          
          {/* HERO SECTION */}
          <Fade in={this.state.checked} timeout={1000}>
            <Grid
              container
              item
              xs={12}
              style={styles.heroContainer}
              justifyContent="space-between"
              alignItems="center"
            >
              {/* TEXT SIDE */}
              <Grow in={this.state.checked} timeout={1500}>
                <Grid item xs={12} md={6} style={styles.textSide}>
                  <Typography variant="body2" style={styles.tagline}>
                    Share your Music with Others
                  </Typography>

                  <Typography variant="h2" style={styles.mainTitle}>
                    TuneShare
                  </Typography>

                  <Typography variant="body1" style={styles.description}>
                    TuneShare enables Spotify Premium users to host a Music Room in which
                    all participants can listen to the same songs together.
                  </Typography>

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
              </Grow>

              {/* IMAGE SIDE */}
              <Grow in={this.state.checked} timeout={2000}>
                <Grid item xs={12} md={6} style={styles.imageSide}>
                  <Fade in={this.state.checked} timeout={2500}>
                    <img
                      src="../../static/images/circle.png"
                      alt="Colorful Circle"
                      style={styles.circleImage}
                    />
                  </Fade>
                  <Fade in={this.state.checked} timeout={3000}>
                    <img
                      src="../../static/images/laptop.png"
                      alt="Laptop"
                      style={styles.laptopImage}
                    />
                  </Fade>
                </Grid>
              </Grow>
            </Grid>
          </Fade>

          {/* BOTTOM CIRCLE */}
          <Fade in={this.state.checked} timeout={3500}>
            <img
              src="../../static/images/circle.png"
              alt="Bottom Circle"
              style={styles.bottomCircle}
            />
          </Fade>
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
    overflowX: "hidden",
    paddingBottom: 50,
    fontFamily: "Nunito, sans-serif", // Original font family
  },
  navbar: {
    padding: "1rem 5%",
    position: "relative",
    zIndex: 2,
  },
  navItems: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  logoImage: {
    width: "60px",
    height: "60px",
    marginRight: "0.5rem",
  },
  navBrand: {
    fontWeight: "bold",
    marginRight: "1rem",
    fontSize: "1.8rem",
    fontFamily: "Nunito, sans-serif", // Explicit font for brand
    textDecoration: "none",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
    whiteSpace: "nowrap",
    fontFamily: "Nunito, sans-serif", // Explicit font for links
    fontWeight: 600,
  },
  heroContainer: {
    flexGrow: 1,
    padding: "3rem 5%",
    position: "relative",
    zIndex: 1,
  },
  textSide: {
    position: "relative",
    zIndex: 2,
    maxWidth: "550px",
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
    maxWidth: "400px",
  },
  createButton: {
    background: "linear-gradient(to right, #3B82F6, #6366F1)",
    color: "#fff",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    padding: "0.75rem 1.5rem",
    width: "100%",
    maxWidth: "300px",
  },
  joinButton: {
    background: "linear-gradient(to right, #ec4899, #f43f5e)",
    color: "#fff",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    padding: "0.75rem 1.5rem",
    width: "100%",
    maxWidth: "300px",
  },
  imageSide: {
    position: "relative",
    height: "400px",
    marginTop: "2rem",
    zIndex: 0,
  },
  circleImage: {
    position: "absolute",
    width: "120%",
    maxWidth: "600px",
    left: "-30%",
    top: "0",
    opacity: 0.8,
  },
  laptopImage: {
    position: "absolute",
    width: "100%",
    maxWidth: "600px",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
  bottomCircle: {
    position: "absolute",
    left: "-100px",
    bottom: "-50px",
    width: "300px",
    opacity: 0.7,
    display: "none",
  },
};

const mediaQueries = `
  @media (max-width: 700px) {
    .navBrand {
      font-size: 1.5rem !important;
    }
    .navLink {
      font-size: 0.9rem !important;
    }
    .heroContainer {
      padding: 2rem 5% !important;
    }
    .mainTitle {
      font-size: 2.5rem !important;
    }
    .tagline {
      font-size: 1.2rem !important;
    }
    .description {
      font-size: 1.1rem !important;
    }
    .buttonColumn {
      max-width: 100% !important;
    }
    .imageSide {
      height: 300px !important;
    }
    .circleImage {
      left: -50% !important;
    }
  }

  @media (min-width: 1280px) {
    .createButton, .joinButton {
      font-size: 1.3rem !important;
      padding: 1rem 2rem !important;
      max-width: 350px !important;
    }
    .mainTitle {
      font-size: 4rem !important;
    }
    .navBrand {
      font-size: 2rem !important;
    }
    .navLink {
      font-size: 1.1rem !important;
    }
  }
`;

// Inject media queries into the document head
const styleElement = document.createElement('style');
styleElement.appendChild(document.createTextNode(mediaQueries));
document.head.appendChild(styleElement);
