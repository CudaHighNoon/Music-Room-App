// SpotifyEmbedded.js
import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";

export default function SpotifyEmbedded({ currentSong }) {
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentSong && currentSong.title && currentSong.artist) {
      // Fetch lyrics from the backend for the current song
      fetch(
        `/api/lyrics?title=${encodeURIComponent(
          currentSong.title
        )}&artist=${encodeURIComponent(currentSong.artist)}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Lyrics not found");
          }
          return response.json();
        })
        .then((data) => {
          setLyrics(data.lyrics);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLyrics("Lyrics not available.");
          setLoading(false);
        });
    }
  }, [currentSong]);

  return (
    <div style={styles.embeddedContainer}>
      <Typography variant="h6" style={styles.header}>Lyrics</Typography>
      {loading ? (
        <p style={styles.info}>Loading lyrics...</p>
      ) : (
        <pre style={styles.lyrics}>{lyrics}</pre>
      )}
      <p style={styles.info}>
        Lyrics provided for the current song.
      </p>
    </div>
  );
}

const styles = {
  embeddedContainer: {
    backgroundColor: "#2b2b2b",
    borderRadius: "8px",
    padding: "1rem",
    color: "#fff",
  },
  header: {
    marginTop: 0,
    marginBottom: "0.5rem",
  },
  lyrics: {
    whiteSpace: "pre-wrap",
    fontSize: "1rem",
    lineHeight: "1.5",
    color: "#fff",
  },
  info: {
    fontSize: "0.9rem",
    color: "#ccc",
  },
};
