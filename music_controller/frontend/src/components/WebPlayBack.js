// WebPlayBack.js
import React, { useEffect, useState } from "react";

export default function WebPlayBack() {
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Dynamically load the Spotify Web Playback SDK script
    if (!window.Spotify) {
      const scriptTag = document.createElement("script");
      scriptTag.src = "https://sdk.scdn.co/spotify-player.js";
      scriptTag.async = true;
      document.body.appendChild(scriptTag);
    }

    // Initialize the Spotify Web Playback SDK when ready
    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Music Room Web Playback",
        getOAuthToken: async (cb) => {
          const response = await fetch("/spotify/get-playback-token");
          const data = await response.json();
          if (data.access_token) {
            cb(data.access_token);
          } else {
            console.error("Failed to fetch Spotify access token:", data);
          }
        },
        volume: 0.5,
      });

      // Add event listeners for player state
      spotifyPlayer.addListener("initialization_error", ({ message }) => {
        console.error("Initialization Error:", message);
      });

      spotifyPlayer.addListener("authentication_error", ({ message }) => {
        console.error("Authentication Error:", message);
      });

      spotifyPlayer.addListener("account_error", ({ message }) => {
        console.error("Account Error:", message);
      });

      spotifyPlayer.addListener("playback_error", ({ message }) => {
        console.error("Playback Error:", message);
      });

      spotifyPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;
        console.log("Player State Changed:", state);
      });

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID:", device_id);
        setIsReady(true);
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline:", device_id);
      });

      // Connect the player
      spotifyPlayer.connect().then((success) => {
        if (success) {
          console.log("The Web Playback SDK successfully connected!");
        }
      });

      // Save the player instance
      setPlayer(spotifyPlayer);
    };
  }, []);

  const handleVolumeChange = (event) => {
    const volume = parseFloat(event.target.value);
    if (player) {
      player.setVolume(volume).catch((error) =>
        console.error("Error setting volume:", error)
      );
    }
  };

  return (
    <div style={styles.container}>
      {!isReady ? (
        <p style={styles.statusText}>Initializing Spotify Playback...</p>
      ) : (
        <>
          <p style={styles.statusText}>Spotify Web Playback is Ready!</p>
          <div style={styles.controls}>
            <label style={styles.label}>
              Volume:
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                defaultValue="0.5"
                onChange={handleVolumeChange}
                style={styles.slider}
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#2b2b2b",
    borderRadius: "6px",
    padding: "1rem",
    color: "#fff",
    fontFamily: "Nunito, sans-serif",
  },
  statusText: {
    color: "#fff",
    margin: 0,
    fontSize: "1.2rem",
    textAlign: "center",
  },
  controls: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
  label: {
    color: "#fff",
    fontSize: "1rem",
  },
  slider: {
    marginLeft: "0.5rem",
  },
};
