import React from "react";
import { AgoraVideoPlayer } from "agora-rtc-react";
import { Grid } from "@mui/material";
import { useState, useEffect } from "react";

function Videos(props) {
  const { users, tracks } = props;
  const { gridSapcing, setGridSpacing } = useState(12);

  useEffect(() => {
    setGridSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4));
  }, [users, tracks]);

  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item xs={gridSapcing}>
        <AgoraVideoPlayer videoTrack={tracks[1]} style={{ height: "100%", width: "100%" }} />
      </Grid>
      <Grid item xs={gridSapcing}>
        {users.length > 0 &&
          users.map((user) => {
            if (user.videoTrack) {
              return (
                <Grid item xs={gridSapcing}>
                  <AgoraVideoPlayer
                    key={user.uid}
                    videoTrack={user.videoTrack}
                    style={{ height: "100%", width: "100%" }}
                  />
                </Grid>
              );
            } else {
              return null;
            }
          })}
      </Grid>
    </Grid>
  );
}

export default Videos;
