import React, { Component } from "react";
import { Typography, IconButton, LinearProgress } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

export default class MusicPlayer extends Component {
  constructor(props) {
    super(props);
  }

  pauseSong() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/pause", requestOptions);
  }

  playSong() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/play", requestOptions);
  }

  skipSong() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/skip", requestOptions);
  }

  render() {
    // If we have no valid track data yet, show a placeholder box
    // with the same size so the layout doesn’t jump.
    if (!this.props.title) {
      return (
        <div style={styles.placeholderContainer}>
          {/* Optional: some "loading..." text or spinner */}
          <Typography style={{ color: "#fff" }}>Loading Song...</Typography>
        </div>
      );
    }

    // We do have song data, so the container will do a slide-in animation
    const showPlayPause = this.props.isHost || this.props.guestCanPause;

    // Calculate progress for the progress bar
    const progress = this.props.duration
      ? (this.props.time / this.props.duration) * 100
      : 0;

    return (
      <>
        {/* Keyframe for the slideIn animation */}
        <style>
          {`
            @keyframes slideIn {
              0% {
                transform: translateY(20px);
                opacity: 0;
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}
        </style>

        <div style={styles.playerContainer}>
          {/* LEFT: Album Art */}
          <div style={styles.albumArtContainer}>
            {this.props.image_url ? (
              <img
                src={this.props.image_url}
                alt="Album Cover"
                style={styles.albumArt}
              />
            ) : (
              <div style={styles.albumPlaceholder}>
                <Typography style={{ color: "#fff" }}>Song Icon Here</Typography>
              </div>
            )}
          </div>

          {/* RIGHT: Track Info + Controls */}
          <div style={styles.infoContainer}>
            <Typography style={styles.trackTitle}>
              {this.props.title || "Song Title"}
            </Typography>
            <Typography style={styles.artistName}>
              {this.props.artist || "Unknown Artist"}
            </Typography>

            {/* Controls Row */}
            <div style={styles.controlsRow}>
              {/* Conditionally render play/pause only if host or guestCanPause */}
              {showPlayPause && (
                <IconButton
                  onClick={() =>
                    this.props.is_playing ? this.pauseSong() : this.playSong()
                  }
                  style={styles.controlButton}
                >
                  {this.props.is_playing ? (
                    <PauseIcon style={styles.iconStyle} />
                  ) : (
                    <PlayArrowIcon style={styles.iconStyle} />
                  )}
                </IconButton>
              )}

              {/* Skip button always shown */}
              <IconButton
                onClick={() => this.skipSong()}
                style={styles.controlButton}
              >
                <SkipNextIcon style={styles.iconStyle} />
              </IconButton>
            </div>

            {/* Progress Bar */}
            <LinearProgress
              variant="determinate"
              value={progress}
              style={styles.progressBar}
            />

            {/* Votes to Skip */}
            <Typography style={styles.votesText}>
              Votes to Skip: {this.props.votes || 0}/
              {this.props.votes_required || 0}
            </Typography>
          </div>
        </div>
      </>
    );
  }
}

const styles = {
  // Container that slides in only once we have data
  playerContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#2b2b2b",
    borderRadius: "8px",
    padding: "1rem",
    gap: "1rem",
    animation: "slideIn 0.7s ease-out forwards",
    opacity: 0,
    // We can define a minHeight to ensure consistent layout if desired
    minHeight: "220px",
  },

  // Placeholder box used if we don't have any song data yet
  placeholderContainer: {
    backgroundColor: "#2b2b2b",
    borderRadius: "8px",
    padding: "1rem",
    minHeight: "220px", // same as playerContainer
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  albumArtContainer: {
    flex: "0 0 auto",
  },
  albumArt: {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  albumPlaceholder: {
    width: "200px",
    height: "200px",
    backgroundColor: "#3490eb",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  trackTitle: {
    fontFamily: "Nunito, sans-serif",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "0.3rem",
  },
  artistName: {
    fontFamily: "Nunito, sans-serif",
    fontSize: "1rem",
    color: "#ccc",
    marginBottom: "1rem",
  },
  controlsRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "0.8rem",
  },
  controlButton: {
    backgroundColor: "#111",
    borderRadius: "6px",
    padding: "6px",
  },
  iconStyle: {
    fontSize: "2rem",
    color: "#fff",
  },
  progressBar: {
    height: "6px",
    borderRadius: "3px",
    marginBottom: "0.6rem",
  },
  votesText: {
    fontFamily: "Nunito, sans-serif",
    fontSize: "0.95rem",
    color: "#fff",
  },
};
