import React, { Component } from "react";
import {
  Typography,
  TextField,
  Button,
  FormHelperText,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { Link } from "react-router-dom";

class CreateRoomPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      userName: "Alien",
      error: false,
      guestCanPause: true, // reintroduce this from original code
    };

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.changeVotes = this.changeVotes.bind(this);
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
  }

  /** Increase/decrease votes, but don’t go below 1 **/
  changeVotes(delta) {
    this.setState((prev) => {
      const newVal = prev.votesToSkip + delta;
      return { votesToSkip: newVal < 1 ? 1 : newVal };
    });
  }

  /** Toggle guestCanPause checkbox **/
  handleGuestCanPauseChange() {
    this.setState((prev) => ({
      guestCanPause: !prev.guestCanPause,
    }));
  }

  /** Handle text input for user name **/
  handleTextFieldChange(e) {
    this.setState({ userName: e.target.value });
  }

  /** POST request to create new room + add user, then navigate to the room **/
  handleRoomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause, // sending to backend
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.code) {
          // If room created, add user
          const requestOptions2 = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: this.state.userName,
            }),
          };
          fetch("/api/add-user", requestOptions2).then((response) => {
            if (response.ok) {
              this.props.history.push("/room/" + data.code);
            } else {
              this.setState({ error: "Name is Taken" });
            }
          });
        } else {
          this.setState({ error: "Error creating room" });
        }
      });
  }

  render() {
    return (
      <>
        <style>
          {`
            @keyframes slideInBottom {
              0% {
                transform: translateY(50px);
                opacity: 0;
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }
            @keyframes slideInLeft {
              0% {
                transform: translateX(-80px);
                opacity: 0;
              }
              100% {
                transform: translateX(0);
                opacity: 1;
              }
            }
            @keyframes slideInRight {
              0% {
                transform: translateX(80px);
                opacity: 0;
              }
              100% {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}
        </style>

        <div style={styles.pageWrapper}>
          {/* Circles sliding in from sides */}
          <img
            src="../../static/images/circle.png"
            alt="Circle Left"
            style={styles.circleLeft}
          />
          <img
            src="../../static/images/circle.png"
            alt="Circle Right"
            style={styles.circleRight}
          />
          <img
            src="../../static/images/circle.png"
            alt="Circle BottomLeft"
            style={styles.circleBottomLeft}
          />

          {/* Dark box in center, slides in from bottom */}
          <div style={styles.createBox}>
            <Typography variant="h3" style={styles.title}>
              Create Room
            </Typography>

            {/* Votes to Skip (with custom arrow buttons) */}
            <div style={styles.voteRow}>
              <TextField
                value={this.state.votesToSkip}
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
                {/* Up Arrow */}
                <Button
                  style={styles.arrowButton}
                  onClick={() => this.changeVotes(+1)}
                >
                  &#9650;
                </Button>
                {/* Down Arrow */}
                <Button
                  style={styles.arrowButton}
                  onClick={() => this.changeVotes(-1)}
                >
                  &#9660;
                </Button>
              </div>
            </div>

            <FormHelperText style={styles.helperText}>
              Votes Required to Skip Song
            </FormHelperText>

            {/* Guest Can Pause checkbox */}
            <div style={styles.checkBoxRow}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.guestCanPause}
                    onChange={this.handleGuestCanPauseChange}
                    style={{ color: "#fff" }}
                  />
                }
                label="Guest Can Pause"
                style={{ color: "#fff", fontFamily: "Nunito, sans-serif" }}
              />
            </div>

            {/* Name field */}
            <TextField
              label="Enter a Name"
              placeholder="Enter a Name"
              value={this.state.userName}
              variant="outlined"
              onChange={this.handleTextFieldChange}
              style={styles.textField}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{
                style: {
                  color: "#fff",
                  fontFamily: "Nunito, sans-serif",
                },
              }}
              error={Boolean(this.state.error)}
            />

            {/* CREATE ROOM button */}
            <Button
              variant="contained"
              onClick={this.handleRoomButtonPressed}
              style={styles.createRoomButton}
            >
              Create Room
            </Button>

            {/* BACK button */}
            <Button
              variant="contained"
              to="/"
              component={Link}
              style={styles.backButton}
            >
              Back
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default CreateRoomPage;

/** 
 * Inline styles. 
 * You can adjust colors, positions, spacing, etc. 
 */
const styles = {
  pageWrapper: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#000",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Nunito, sans-serif",
    color: "#fff",
  },
  circleLeft: {
    position: "absolute",
    top: "10%",
    left: "-150px",
    width: "400px",
    animation: "slideInLeft 1s ease-out forwards",
    opacity: 0,
  },
  circleRight: {
    position: "absolute",
    top: "20%",
    right: "-200px",
    width: "500px",
    animation: "slideInRight 1.2s ease-out forwards",
    opacity: 0,
  },
  circleBottomLeft: {
    position: "absolute",
    bottom: "-100px",
    left: "-100px",
    width: "300px",
    animation: "slideInLeft 1.4s ease-out forwards",
    opacity: 0,
  },
  createBox: {
    backgroundColor: "rgba(25, 25, 25, 0.95)",
    borderRadius: "6px",
    padding: "2rem 3rem",
    maxWidth: "400px",
    width: "90%",
    boxSizing: "border-box",
    textAlign: "center",
    animation: "slideInBottom 0.8s ease-out forwards",
    opacity: 0,
  },
  title: {
    marginBottom: "1.5rem",
    fontWeight: "bold",
    fontFamily: "Nunito, sans-serif",
  },
  voteRow: {
    display: "flex",
    justifyContent: "center",
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
    marginBottom: "1rem",
    fontFamily: "Nunito, sans-serif",
  },
  checkBoxRow: {
    marginBottom: "1rem",
  },
  textField: {
    marginBottom: "1rem",
    width: "100%",
    backgroundColor: "#111",
    borderRadius: "4px",
  },
  createRoomButton: {
    background: "linear-gradient(to right, #3B82F6, #6366F1)",
    color: "#fff",
    fontWeight: "bold",
    textTransform: "none",
    width: "100%",
    marginBottom: "1rem",
    fontFamily: "Nunito, sans-serif",
  },
  backButton: {
    background: "linear-gradient(to right, #ec4899, #f43f5e)",
    color: "#fff",
    fontWeight: "bold",
    textTransform: "none",
    width: "100%",
    fontFamily: "Nunito, sans-serif",
  },
};
