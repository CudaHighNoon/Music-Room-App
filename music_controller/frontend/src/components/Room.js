import React, { Component } from "react";
import {
  Typography,
  Button,
  TextField,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import MusicPlayer from "./MusicPlayer";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,         // "real" server value
      tempVotesToSkip: 2,     // local arrow-button value
      guestCanPause: false,   // "real" server value
      tempGuestCanPause: false, // local checkbox value
      isHost: false,
      spotifyAuthenticated: false,
      song: {},
      names: [],
      errorMsg: "",
      successMsg: "",
      isInitialized: false, // track first load
    };

    this.roomCode = this.props.match.params.roomCode;
    this.userName = this.props.match.params.userName;

    // Binds
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);

    this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
    this.handleTempGuestCanPauseChange = this.handleTempGuestCanPauseChange.bind(this);
    this.changeTempVotes = this.changeTempVotes.bind(this);

    // Initial fetch
    this.getRoomDetails();
  }

  componentDidMount() {
    // Poll every second
    this.interval = setInterval(() => {
      this.getCurrentSong();
      this.getRoomDetails();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getRoomDetails() {
    fetch(`/api/get-room?code=${this.roomCode}`)
      .then((response) => {
        if (!response.ok) {
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        // set "real" server values
        // only set the "temp" ones on first load
        this.setState((prev) => {
          const newState = {
            votesToSkip: data.votes_to_skip,
            guestCanPause: data.guest_can_pause,
            isHost: data.is_host,
            names: data.names,
          };
          if (!prev.isInitialized) {
            newState.tempVotesToSkip = data.votes_to_skip;
            newState.tempGuestCanPause = data.guest_can_pause;
            newState.isInitialized = true;
          }
          return newState;
        });

        if (data.is_host) {
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
          return {};
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ song: data });
      });
  }

  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then(() => {
      this.props.leaveRoomCallback();
      this.props.history.push("/");
    });
  }

  // Arrow up/down for tempVotesToSkip
  changeTempVotes(delta) {
    this.setState((prev) => {
      let newVal = prev.tempVotesToSkip + delta;
      if (newVal < 1) newVal = 1;
      return { tempVotesToSkip: newVal };
    });
  }

  // Toggle the "temp" guest can pause checkbox
  handleTempGuestCanPauseChange() {
    this.setState((prev) => ({
      tempGuestCanPause: !prev.tempGuestCanPause,
    }));
  }

  // PATCH -> unify real and temp on success
  handleUpdateButtonPressed() {
    this.setState({ errorMsg: "", successMsg: "" });
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: this.roomCode,
        votes_to_skip: this.state.tempVotesToSkip,
        guest_can_pause: this.state.tempGuestCanPause,
      }),
    };

    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        this.setState((prev) => ({
          votesToSkip: prev.tempVotesToSkip,
          guestCanPause: prev.tempGuestCanPause,
          successMsg: "Room updated successfully!",
        }));
      } else {
        this.setState({ errorMsg: "Error updating room..." });
      }
    });
  }

  /** Renders the permanent left sidebar with the guest list and an icon above "Room Members" */
  renderSidebar() {
    return (
      <Drawer variant="permanent" anchor="left">
        <div style={styles.drawerContent}>
          <img
            src="../../static/images/logo.png"
            alt="Room Icon"
            style={styles.sidebarIcon}
          />

          <Typography variant="h6" align="center" style={styles.participantsTitle}>
            Room Members
          </Typography>

          <Divider style={styles.divider} />
          <List>
            {this.state.names.map((name, index) => (
              <ListItem key={index} style={{ color: "#fff" }}>
                <ListItemText primary={name} style={styles.guestNameText} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    );
  }

  render() {
    return (
      <>
        <style>
          {`
            @keyframes slideInSettings {
              0% {
                transform: translateY(40px);
                opacity: 0;
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}
        </style>

        <div style={styles.pageWrapper}>
          {this.renderSidebar()}

          <div style={styles.mainContent}>
            <Typography style={styles.roomTitle}>
              Music Room: {this.roomCode}
            </Typography>

            <div style={styles.songBox}>
              <MusicPlayer
                title={this.state.song.title}
                artist={this.state.song.artist}
                is_playing={this.state.song.is_playing}
                image_url={this.state.song.image_url}
                time={this.state.song.time}
                duration={this.state.song.duration}
                votes={this.state.song.votes}
                votes_required={this.state.votesToSkip}
                isHost={this.state.isHost}
                guestCanPause={this.state.guestCanPause}
              />
              <Button
                variant="contained"
                style={styles.leaveButton}
                onClick={this.leaveButtonPressed}
              >
                Leave Room
              </Button>
            </div>

            {/* The "Settings" box only if isHost */}
            {this.state.isHost && (
              <div style={styles.settingsBox}>
                <Typography style={styles.settingsTitle}>Room Settings</Typography>

                <div style={styles.settingsRow}>
                  {/* Votes to skip w/ arrow up/down */}
                  <div style={styles.votesColumn}>
                    <div style={styles.voteRow}>
                      <TextField
                        value={this.state.tempVotesToSkip}
                        variant="outlined"
                        style={styles.voteTextField}
                        inputProps={{
                          readOnly: true,
                          style: {
                            color: "#fff",
                            textAlign: "center",
                            fontFamily: "Nunito, sans-serif",
                            fontSize: "1rem",
                          },
                        }}
                      />
                      <div style={styles.arrowContainer}>
                        <Button
                          style={styles.arrowButton}
                          onClick={() => this.changeTempVotes(+1)}
                        >
                          &#9650;
                        </Button>
                        <Button
                          style={styles.arrowButton}
                          onClick={() => this.changeTempVotes(-1)}
                        >
                          &#9660;
                        </Button>
                      </div>
                    </div>
                    <FormHelperText style={styles.helperText}>
                      Votes Required to Skip Song
                    </FormHelperText>
                  </div>

                  {/* Guest can pause checkbox (temp) */}
                  <div style={styles.pauseColumn}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.tempGuestCanPause}
                          onChange={this.handleTempGuestCanPauseChange}
                          style={{ color: "#fff" }}
                        />
                      }
                      label="Guest Can Pause"
                      style={styles.checkLabel}
                    />
                  </div>
                </div>

                {/* Save Changes button */}
                <Button
                  variant="contained"
                  style={styles.saveButton}
                  onClick={this.handleUpdateButtonPressed}
                >
                  Save Changes
                </Button>

                {this.state.errorMsg && (
                  <Typography style={styles.errorText}>
                    {this.state.errorMsg}
                  </Typography>
                )}
                {this.state.successMsg && (
                  <Typography style={styles.successText}>
                    {this.state.successMsg}
                  </Typography>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

/** Inline styles */
const styles = {
  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#000",
    fontFamily: "Nunito, sans-serif",
    color: "#fff",
  },
  drawerContent: {
    width: 250,
    height: "100%",
    backgroundColor: "#2d2d2d",
    padding: "0.5rem",
  },
  sidebarIcon: {
    width: "80px",
    display: "block",
    margin: "0 auto 1rem auto",
  },
  participantsTitle: {
    padding: "8px 0",
    color: "#fff",
  },
  divider: {
    backgroundColor: "#555",
    marginBottom: "1rem",
  },
  guestNameText: {
    color: "#fff",
  },
  mainContent: {
    marginLeft: 250, // offset for drawer
    marginRight: 50,
    flexGrow: 1,
    padding: "2rem",
  },
  roomTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "2rem",
  },
  songBox: {
    backgroundColor: "#1f1f1f",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  leaveButton: {
    background: "linear-gradient(to right, #3B82F6, #6366F1)",
    color: "#fff",
    fontWeight: "bold",
    textTransform: "none",
    marginTop: "1rem",
  },
  settingsBox: {
    backgroundColor: "#1f1f1f",
    borderRadius: "8px",
    padding: "1.5rem",
    animation: "slideInSettings 0.8s ease-out forwards",
    opacity: 0,
  },
  settingsTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
  },
  settingsRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: "2rem",
    marginBottom: "1.5rem",
  },
  votesColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  voteRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  voteTextField: {
    width: "60px",
    backgroundColor: "#111",
    borderRadius: "4px",
  },
  arrowContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "0.5rem",
  },
  arrowButton: {
    backgroundColor: "#111",
    color: "#fff",
    minWidth: "40px",
    marginBottom: "4px",
    fontSize: "1.2rem",
    textTransform: "none",
  },
  helperText: {
    color: "#fff",
    margin: 0,
    fontFamily: "Nunito, sans-serif",
  },
  pauseColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  checkLabel: {
    color: "#fff",
    fontSize: "1rem",
  },
  saveButton: {
    background: "linear-gradient(to right, #3B82F6, #6366F1)",
    color: "#fff",
    fontWeight: "bold",
    textTransform: "none",
    marginBottom: "1rem",
    width: "100%",
  },
  errorText: {
    color: "red",
    marginTop: "0.5rem",
  },
  successText: {
    color: "green",
    marginTop: "0.5rem",
  },
};
