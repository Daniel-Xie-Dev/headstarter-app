import React from "react";
import { useState, useEffect } from "react";
import { config, useClient, useMicrophoneAndCameraTracks, channelName } from "../../agora";
import { Grid } from "@mui/material";
import Controls from "./Controls";
import Videos from "./Videos";

function VideoCall(props) {
  const { setInCall } = props;

  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    const init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }

        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
        }
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      try {
        await client.join(config.appId, name, config.token, null);
      } catch (error) {
        console.log(error);
      }

      if (tracks) await client.publish(tracks[0], tracks[1]);
      setStart(true);
    };

    if (ready && tracks) {
      try {
        init(channelName);
        console.log("Resolved!");
      } catch (error) {
        console.log(error);
      }
    }

    // return async () => {
    //   await client.leave();
    //   client.removeAllListeners();
    //   tracks[0].close();
    //   tracks[1].close();
    //   setStart(false);
    //   setInCall(false);
    // };
  }, [channelName, client, ready, tracks]);

  return (
    <Grid container direction={"column"} style={{ height: "100%" }}>
      <Grid item style={{ height: "5%" }}>
        {ready && tracks && <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />}
      </Grid>
      <Grid item style={{ height: "95%" }}>
        {start && tracks && <Videos tracks={tracks} users={users} setInCall={setInCall} />}
      </Grid>
    </Grid>
  );
}

export default VideoCall;
