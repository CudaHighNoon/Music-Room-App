import React, { Component } from "react";
import { Grid, Typography, TextField, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

export default class RoomJoinPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: "",
      error: "",
      userName:"Unknown Entity"
    };

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.roomButtonPressed = this.roomButtonPressed.bind(this);
  }

  handleTextFieldChange(e) {
    this.setState({
      roomCode: e.target.value,
    });
  }

  roomButtonPressed() {
   const requestOptions = {
    method: "POST",
    headers:{"content-type":"application/json"},
    body: JSON.stringify({
      code: this.state.roomCode,
      names: this.state.userName,
    }),


   };
   fetch("/api/join-room", requestOptions).then((response) => {

    if(response.ok){

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
                print(response)
                this.props.history.push(`/room/${this.state.roomCode}`);
              } else {
                this.setState({ error: "Name is Taken" });
              }
            });
    }else{
      this.setState({error: "Room not found."});
    }
   });
   }
  

  render() {
    return (
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Join a Room
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <TextField
            error={this.state.error}
            label="Code"
            placeholder="Enter a Room Code"
            value={this.state.roomCode}
            helperText={this.state.error}
            variant="outlined"
            onChange={this.handleTextFieldChange}
            default={this.state.roomCode}
          />
        </Grid>
        
        <Grid item xs={12} align="center" padding="5px">
        <TextField
          label="Name"
          placeholder="Enter a Name"
          value={this.state.userName}
          variant="outlined"
          onChange={(e)=>{  this.setState({
            userName: e.target.value,
          });}}
        />
      </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="primary"
            onClick={this.roomButtonPressed}
         
          >
            Enter Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="secondary" to={`/`} component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }}  
