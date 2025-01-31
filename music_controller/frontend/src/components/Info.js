import React from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

// Define styles using JavaScript objects
const styles = {
  pageWrapper: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
    overflowY: "auto", // Allow vertical scrolling
    paddingBottom: 50,
    fontFamily: "Nunito, sans-serif", // Original font family
  },
  content: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem 1rem", // Added horizontal padding for better spacing on small screens
    // Removed overflowY to allow natural scrolling
  },
  featureGrid: {
    padding: "2rem 0",
  },
  featureIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  backButton: {
    marginTop: "3rem",
    background: "linear-gradient(to right, #3B82F6, #6366F1)",
    padding: "0.75rem 2rem",
    fontSize: "1.1rem",
  },
};

// Define media queries as a string
const mediaQueries = `
  @media (max-height: 700px) and (max-width: 768px) {
    .pageWrapper {
      min-height: 100vh;
      overflow-y: auto;
    }
    
    .featureGrid {
      padding: 1rem 0 !important;
    }
    
    h2 {
      font-size: 1.8rem !important;
      margin-bottom: 1rem !important;
    }
    
    h4 {
      font-size: 1.2rem !important;
      margin-bottom: 0.5rem !important;
    }
    
    .body1 {
      font-size: 0.9rem !important;
      line-height: 1.4 !important;
    }
    
    .backButton {
      margin-top: 1.5rem !important;
      padding: 0.5rem 1.5rem !important;
    }
  }

  @media (max-width: 480px) {
    .navItems {
      gap: 1rem !important;
    }
    h2 {
      font-size: 1.8rem !important;
    }
    h4 {
      font-size: 1.2rem !important;
    }
  }
`;

// Inject media queries into the document head
const injectMediaQueries = () => {
  if (typeof document !== "undefined") {
    const styleElement = document.createElement("style");
    styleElement.appendChild(document.createTextNode(mediaQueries));
    document.head.appendChild(styleElement);
  }
};

// Call the function to inject media queries
injectMediaQueries();

export default function Info(props) {
  return (
    <div style={styles.pageWrapper} className="pageWrapper">
      <Navbar />

      {/* Main Content */}
      <div style={styles.content}>
        <Grid container spacing={4}>
          <Grid item xs={12} align="center">
            <Typography
              variant="h2"
              style={{ fontWeight: "bold", marginBottom: "2rem" }}
            >
              About TuneShare
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} style={styles.featureGrid}>
            <Typography
              variant="h4"
              style={{ marginBottom: "1rem" }}
              className="featureTitle"
            >
              🎵 Shared Listening Experience
            </Typography>
            <Typography variant="body1" className="body1">
              TuneShare allows Spotify Premium users to create synchronized listening rooms
              where everyone hears the same music simultaneously. Perfect for parties,
              remote hangouts, or shared workout sessions.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} style={styles.featureGrid}>
            <Typography
              variant="h4"
              style={{ marginBottom: "1rem" }}
              className="featureTitle"
            >
              🎛️ Collaborative Control
            </Typography>
            <Typography variant="body1" className="body1">
              All participants can queue songs, adjust volume, and control playback.
              The host maintains ultimate control while allowing guests to contribute
              to the shared playlist.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} style={styles.featureGrid}>
            <Typography
              variant="h4"
              style={{ marginBottom: "1rem" }}
              className="featureTitle"
            >
              🌐 Cross-Platform Access
            </Typography>
            <Typography variant="body1" className="body1">
              Access your music rooms from any device - desktop, mobile, or tablet.
              Seamlessly switch between devices without interrupting the playback.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} style={styles.featureGrid}>
            <Typography
              variant="h4"
              style={{ marginBottom: "1rem" }}
              className="featureTitle"
            >
              🔒 Secure & Private
            </Typography>
            <Typography variant="body1" className="body1">
              Private room codes ensure your listening sessions stay secure.
              Temporary guest access links available for easy sharing.
            </Typography>
          </Grid>

          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              component={Link}
              to="/"
              style={styles.backButton}
              className="backButton"
            >
              Back to Home
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
