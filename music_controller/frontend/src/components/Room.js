import React, { Component } from "react";
import { Grid, Button, Typography, Drawer, List, ListItem, ListItemText,Divider } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      spotifyAuthenticated: false,
      song: {},
      names:[],
      
    };
    this.userName=this.props.match.params.userName;
    this.roomCode = this.props.match.params.roomCode;
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);
    this.renderSidebar=this.renderSidebar.bind(this);
    this.getRoomDetails();
    if (this.state.isHost) {
      this.authenticateSpotify();
    }
  }

  componentDidMount() {
    this.interval = setInterval(()=>{
      this.getCurrentSong()
      this.getRoomDetails()
      console.log(this.userName)
    }, 1000);

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getRoomDetails() {
    return fetch("/api/get-room" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
          names:data.names
        });
       console.log(this.state.names)
       if (this.state.isHost) {
        this.authenticateSpotify();
      }
      });
  }

  authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ spotifyAuthenticated: data.status });
      
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }

  getCurrentSong() {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
         return{}
         
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.setState({ song: data });
        //console.log(this.state.is_playing);
      });
  }

  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      this.props.leaveRoomCallback();
      this.props.history.push("/");
    });
  }

  updateShowSettings(value) {
    this.setState({
      showSettings: value,
    });
  }

  renderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={this.state.votesToSkip}
            guestCanPause={this.state.guestCanPause}
            roomCode={this.roomCode}
            updateCallback={this.getRoomDetails}
          />
        </Grid>
        
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.updateShowSettings(true)}
        >
          Settings
        </Button>
        
      </Grid>
    );
  }
  

  renderSidebar() {
    return (
      <Drawer variant="permanent" anchor="left">
        <div style={{ width: 250 ,height:500}}>
          <Typography variant="h6" align="center" style={{ padding: "16px 0" }}>
            Group Participants
          </Typography>
          <Divider />
          <List>
            {this.state.names.map((name, index) => (
              <ListItem button key={index}>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    );
  }

  render() {
    if (this.state.showSettings) {
      return this.renderSettings();
    }
  
    return (
      <div style={{ display: "fixed" }}>
        
        {this.renderSidebar()}
        
        <div style={{ flexGrow: 1 ,paddingLeft:500}}>
          <Grid container spacing={1}>
            <Grid item xs={12} align="center">
              <Typography component="h4" variant="h4">
                Room Code: {this.roomCode}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <MusicPlayer {...this.state.song} />
            </Grid>
            {this.state.isHost ? this.renderSettingsButton() : null}
            <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={this.leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}