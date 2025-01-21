import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { Typography, Button } from "@material-ui/core";

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
          `}
        </style>

        <div style={styles.pageWrapper}>
          {/* NAVBAR */}
          <div style={styles.navbar}>
            <div style={styles.navItems}>
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
            </div>
          </div>

          {/* HERO SECTION */}
          <div style={styles.heroContainer}>
            {/* LEFT TEXT SIDE (slides in from left) */}
            <div style={styles.textSide}>
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

              {/* Buttons in a vertical stack */}
              <div style={styles.buttonColumn}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/create"
                  style={styles.createButton}
                >
                  Create Room
                </Button>

                <Button
                  variant="contained"
                  component={Link}
                  to="/join"
                  style={styles.joinButton}
                >
                  Join Room
                </Button>
              </div>
            </div>

            {/* RIGHT IMAGE SIDE (slides in from right) */}
            <div style={styles.imageSide}>
              {/* Circle now to the LEFT of the laptop */}
              <img
                src="../../static/images/circle.png"
                alt="Colorful Circle"
                style={styles.circleImage}
              />
              <img
                src="../../static/images/laptop.png"
                alt="Laptop"
                style={styles.laptopImage}
              />
            </div>
          </div>

          {/* BOTTOM-LEFT CIRCLE */}
          <img
            src="../../static/images/circle.png"
            alt="Bottom Circle"
            style={styles.bottomCircle}
          />
        </div>
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
    display: "flex",
    flexDirection: "column",
    fontFamily: "Nunito, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  navbar: {
    display: "flex",
    padding: "1rem 2rem",
  },
  navItems: {
    display: "flex",
    alignItems: "center",
  },
  logoImage: {
    width: "100px",
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
  },

  // TEXT SIDE
  textSide: {
    maxWidth: "550px",
    marginBottom: "30rem",
    animation: "slideInLeft 1s ease-out forwards",
  },
  tagline: {
    fontSize: "1.4rem", // bigger tagline
    color: "#ccc",
    marginBottom: "0.8rem",
  },
  mainTitle: {
    fontWeight: "bold",
    marginBottom: "1.8rem",
    fontSize: "3.4rem", // bigger main title
  },
  description: {
    marginBottom: "3rem",
    fontSize: "1.4rem", // bigger body text
    lineHeight: 1.6,
  },

  // Vertical stack for buttons
  buttonColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  // CREATE / JOIN gradient buttons
  createButton: {
    background: "linear-gradient(to right, #3B82F6, #6366F1)",
    color: "#fff",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    padding: "0.75rem 1.5rem",
    textTransform: "none",
    boxShadow: "none",
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
  },

  // IMAGE SIDE
  imageSide: {
    position: "relative",
    minWidth: "300px",
    marginBottom: "20rem",
    textAlign: "center",
    flexShrink: 0,
    marginLeft:"15%",
    animation: "slideInRight 1s ease-out forwards",
  },
  circleImage: {
    // Move circle to the left side
    position: "absolute",
    width: "450px",
    left: "-140px",
    top: "0px",
    zIndex: 1,
  },
  laptopImage: {
    position: "relative",
    zIndex: 2,
    width: "700px",
  },

  // BOTTOM CIRCLE
  bottomCircle: {
    position: "absolute",
    left: "-100px",
    bottom: "-50px",
    width: "300px",
    zIndex: 0,
    opacity: 0.9,
  },
};