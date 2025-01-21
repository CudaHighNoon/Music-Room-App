import React, { Component } from "react";
import { Typography, TextField, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

export default class RoomJoinPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: "",
      error: "",
      userName: "Unknown Entity",
    };

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.roomButtonPressed = this.roomButtonPressed.bind(this);
  }

  handleTextFieldChange(e) {
    this.setState({ roomCode: e.target.value });
  }

  roomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        code: this.state.roomCode,
        names: this.state.userName,
      }),
    };
    fetch("/api/join-room", requestOptions).then((response) => {
      if (response.ok) {
        const requestOptions2 = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: this.state.userName,
          }),
        };
        fetch("/api/add-user", requestOptions2).then((response) => {
          if (response.ok) {
            this.props.history.push(`/room/${this.state.roomCode}`);
          } else {
            this.setState({ error: "Name is Taken" });
          }
        });
      } else {
        this.setState({ error: "Room not found." });
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
          {/* Large circles */}
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

          {/* JOIN BOX (slides up from bottom) */}
          <div style={styles.joinBox}>
            <Typography variant="h3" style={styles.title}>
              Join Room
            </Typography>

            {/* Room Code Field */}
            <TextField
              error={!!this.state.error}
              label="Room Code"
              placeholder="Room Code"
              value={this.state.roomCode}
              helperText={this.state.error}
              variant="outlined"
              onChange={this.handleTextFieldChange}
              style={styles.textField}
              // Make label, input text, helper text all white
              InputLabelProps={{ style: { color: "#fff", fontFamily: "Nunito, sans-serif" } }}
              InputProps={{ style: { color: "#fff", fontFamily: "Nunito, sans-serif" } }}
              FormHelperTextProps={{ style: { color: "#fff", fontFamily: "Nunito, sans-serif" } }}
            />

            {/* User Name Field */}
            <TextField
              label="Enter a Name"
              placeholder="Enter a Name"
              value={this.state.userName}
              variant="outlined"
              onChange={(e) => this.setState({ userName: e.target.value })}
              style={styles.textField}
              // Same approach: all text white
              InputLabelProps={{ style: { color: "#fff", fontFamily: "Nunito, sans-serif" } }}
              InputProps={{ style: { color: "#fff", fontFamily: "Nunito, sans-serif" } }}
              FormHelperTextProps={{ style: { color: "#fff", fontFamily: "Nunito, sans-serif" } }}
            />

            {/* JOIN ROOM BUTTON */}
            <Button
              variant="contained"
              onClick={this.roomButtonPressed}
              style={styles.joinRoomButton}
            >
              Join Room
            </Button>

            {/* BACK BUTTON */}
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
    fontFamily: "Nunito, sans-serif", // Nunito for entire page
    color: "#fff", // all text white by default
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
  joinBox: {
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
  textField: {
    marginBottom: "1rem",
    width: "100%",
    backgroundColor: "#111",
    borderRadius: "4px",
  },
  joinRoomButton: {
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
