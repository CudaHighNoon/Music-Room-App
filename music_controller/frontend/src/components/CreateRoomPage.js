import React, { Component } from "react";
import { Grid, Typography, TextField, FormControl, FormHelperText, Button } from "@material-ui/core";
import {Link} from "react-router-dom";
class CreateRoomPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: true,
      userName: "Alien",
      error: false,
    };

    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
  }

  handleVotesChange(e) {
    this.setState({
      votesToSkip: e.target.value,
    });
  }

  handleTextFieldChange(e) {
    this.setState({
      userName: e.target.value,
    });
  }

  handleRoomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.code) {
          const requestOptions2 = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: this.state.userName,
            }),
          };
          fetch("/api/add-user", requestOptions2)
            .then((response) => {
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

  handleUpdateButtonPressed() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
        code: this.props.roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        this.setState({
          successMsg: "Room updated successfully!",
        });
      } else {
        this.setState({
          errorMsg: "Error updating room...",
        });
      }
    });
  }

  renderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button color="primary" variant="contained" onClick={this.handleRoomButtonPressed}>
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to={"/"} component={Link}>
      Back
    </Button>
    </Grid>
      </Grid>
    );
  }

  renderUpdateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button color="primary" variant="contained" onClick={this.handleUpdateButtonPressed}>
            Update Room
          </Button>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            {this.props.update ? "Update Room" : "Create a Room"}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="number"
              onChange={this.handleVotesChange}
              defaultValue={this.state.votesToSkip}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText>
              <div align="center">Votes Required To Skip Song</div>
            </FormHelperText>
          </FormControl>
        </Grid>
        {!this.props.update && (
          <Grid item xs={12} align="center" padding="5px">
            <TextField
              label="Name"
              placeholder="Enter a Name"
              value={this.state.userName}
              variant="outlined"
              onChange={this.handleTextFieldChange}
              error={Boolean(this.state.error)}

            />
          </Grid>
        )}
        <Grid item xs={12} align="center">
          {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()}
        </Grid>
      </Grid>
    );
  }
}

export default CreateRoomPage;