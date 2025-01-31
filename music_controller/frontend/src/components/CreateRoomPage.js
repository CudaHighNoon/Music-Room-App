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
              0% { transform: translateX(-50px); opacity: 0; }
              100% { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideInRight {
              0% { transform: translateX(50px); opacity: 0; }
              100% { transform: translateX(0); opacity: 1; }
            }
          `}
        </style>

        <Grid container className="relative w-full min-h-screen bg-black text-white flex-col font-nunito m-0 p-0 box-border">
          {/* NAVBAR */}
          <Grid item xs={12} className="flex p-4 md:p-[1rem_2%]">
            <Grid container alignItems="center" className="flex flex-wrap items-center">
              <img
                src="../../static/images/logo.png"
                alt="TuneShare Logo"
                className="w-[8vw] max-w-[100px] mr-2"
              />
              <Typography variant="h5" className="font-bold text-white mr-8 text-[1.8rem] no-underline">
                TuneShare
              </Typography>
              <Link to="/" className="text-white no-underline text-base font-semibold ml-6 hover:text-gray-300 transition-colors">
                Home
              </Link>
              <Link to="/info" className="text-white no-underline text-base font-semibold ml-6 hover:text-gray-300 transition-colors">
                About
              </Link>
            </Grid>
          </Grid>

          {/* HERO SECTION */}
          <Grid
            container
            item
            xs={12}
            className="flex-grow flex items-center justify-between flex-nowrap p-[3rem_5%] box-border h-[30%]"
          >
            {/* LEFT TEXT SIDE */}
            <Grid
              item
              xs={12}
              md={6}
              className="max-w-[550px] mb-8 animate-slideInLeft"
            >
              <Typography variant="body2" className="text-[1.4rem] text-gray-400 mb-2">
                Share your Music with Others
              </Typography>

              <Typography variant="h2" className="font-bold mb-6 text-[3.4rem]">
                TuneShare
              </Typography>

              <Typography variant="body1" className="mb-12 text-[1.4rem] leading-relaxed">
                TuneShare enables Spotify Premium users to host a Music Room in which
                all participants can listen to the same songs together.
              </Typography>

              <Grid container direction="column" spacing={2} className="flex flex-col gap-6">
                <Grid item>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/create"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded py-3 px-6 text-[1.1rem] normal-case shadow-none hover:shadow-md transition-all"
                  >
                    Create Room
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/join"
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded py-3 px-6 text-[1.1rem] normal-case shadow-none hover:shadow-md transition-all"
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
              className="relative min-w-[300px] mb-8 text-center shrink-0 animate-slideInRight"
            >
              <img
                src="../../static/images/circle.png"
                alt="Colorful Circle"
                className="absolute w-[25vw] max-w-[450px] left-[-140px] top-0 z-10"
              />
              <img
                src="../../static/images/laptop.png"
                alt="Laptop"
                className="relative z-20 w-[60vw] max-w-[700px]"
              />
            </Grid>
          </Grid>

          {/* BOTTOM-LEFT CIRCLE */}
          <img
            src="../../static/images/circle.png"
            alt="Bottom Circle"
            className="absolute left-[-100px] bottom-[-50px] w-[300px] z-0 opacity-90 hidden md:block"
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