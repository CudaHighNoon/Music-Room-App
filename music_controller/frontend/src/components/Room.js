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
import WebPlayback from "./WebPlayBack";
import SpotifyEmbedded from "./SpotifyEmbedded";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      tempVotesToSkip: 2,
      guestCanPause: false,
      tempGuestCanPause: false,
      isHost: false,
      spotifyAuthenticated: false,
      song: {},
      names: [],
      errorMsg: "",
      successMsg: "",
      isInitialized: false,
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
    // Poll every second for the current song + room details
    this.interval = setInterval(() => {
      this.getCurrentSong();
      this.getRoomDetails();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /** Fetch room details (votes, isHost, guestCanPause, etc.) */
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
        }, () => {
          // Debugging output for isHost state
          console.log("isHost:", this.state.isHost);
        });

        // Always attempt Spotify authentication after fetching room details
        this.authenticateSpotify();
      });
  }

  /** Check if user is authenticated with Spotify; if not, redirect to OAuth */
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

  /** Fetch current song data from backend (/spotify/current-song) */
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

  /** Leave room => call backend => navigate home */
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

  /** For arrow up/down on VotesToSkip (temp) */
  changeTempVotes(delta) {
    this.setState((prev) => {
      let newVal = prev.tempVotesToSkip + delta;
      if (newVal < 1) newVal = 1;
      return { tempVotesToSkip: newVal };
    });
  }

  /** Toggle "tempGuestCanPause" checkbox */
  handleTempGuestCanPauseChange() {
    this.setState((prev) => ({
      tempGuestCanPause: !prev.tempGuestCanPause,
    }));
  }

  /** PATCH /api/update-room => unify real & temp on success */
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

  /** Render the permanent left sidebar with guest list */
  renderSidebar() {
    return (
      <Drawer variant="permanent" anchor="left">
        <div style={styles.drawerContent}>
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
      <div style={styles.pageWrapper}>
        {this.renderSidebar()}
        <div style={styles.mainContent}>
          <Typography style={styles.roomTitle}>
            Music Room: {this.roomCode}
          </Typography>
          <div style={styles.layoutGrid}>
            {/* LEFT COLUMN => Song Box + Settings */}
            <div style={styles.leftColumn}>
              {/* Song Box */}
              <div style={styles.songBox}>
                <MusicPlayer
                  title={this.state.song.title}
                  artist={this.state.song.artist}
                  is_playing={this.state.song.is_playing}
                  image_url={this.state.song.image_url}
                  time={this.state.song.time}
                  duration={this.state.song.duration}
                  votes={this.state.song.votes}
                  votes_required={this.state.song.votes_required}
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

              {/* Room Settings (host only) */}
              {this.state.isHost ? (
                <div style={styles.settingsBox}>
                  <Typography style={styles.settingsTitle}>
                    Room Settings
                  </Typography>
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

                    {/* Guest can pause checkbox */}
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
              ) : (
                // Debug information when not host
                <Typography style={{ color: "#f00" }}>
                  Not host - Room settings are hidden.
                </Typography>
              )}
            </div>

            {/* RIGHT COLUMN => WebPlayback + Embedded */}
                  <div style={styles.rightColumn}>
        {this.state.spotifyAuthenticated && (
          <div style={styles.webPlaybackBox}>
            <Typography variant="h6" style={{ marginBottom: "0.5rem" }}>
              Spotify Web Playback
            </Typography>
            <WebPlayback
              currentSong={this.state.song}
              isHost={this.state.isHost}
            />
          </div>
        )}

        <div style={styles.spotifyEmbeddedBox}>
          <Typography variant="h6" style={{ marginBottom: "0.5rem" }}>
            Lyrics
          </Typography>
          <SpotifyEmbedded currentSong={this.state.song} />
        </div>
      </div>
            </div>
          </div>
        </div>
      
    );
  }
}

// STYLES
const styles = {
  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#000",
    fontFamily: "Nunito, sans-serif",
    color: "#fff",
    overflow: "visible", // Ensure children aren't clipped
  },
  drawerContent: {
    width: 250,
    height: "100%",
    backgroundColor: "#2d2d2d",
    padding: "0.5rem",
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
    marginLeft: 250,
    flexGrow: 1,
    padding: "2rem",
  },
  roomTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "2rem",
  },
  layoutGrid: {
    display: "flex",
    flexDirection: "row",
    gap: "2rem",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    flex: "1 1 50%",
    alignItems: "stretch", // Ensure children can expand
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    flex: "1 1 50%",
  },
  songBox: {
    backgroundColor: "#1f1f1f",
    borderRadius: "8px",
    padding: "1.5rem",
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
    color: "#fff", 
    minHeight: "50px",  // Ensure settingsBox has height
    minWidth: "200px",  // Ensure settingsBox has width
    position: "relative",
    zIndex: 10,
  },
  settingsTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#fff",
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
  webPlaybackBox: {
    backgroundColor: "#1f1f1f",
    borderRadius: "8px",
    padding: "1.5rem",
  },
  spotifyEmbeddedBox: {
    backgroundColor: "#1f1f1f",
    borderRadius: "8px",
    padding: "1.5rem",
  },
};
