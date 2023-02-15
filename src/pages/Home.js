import { VideoCall } from "@mui/icons-material";
import { Button } from "@mui/material";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore/lite";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calender from "../components/Calender/Calender";
import SideNavigation from "../components/SideNavigation/SideNavigation";
import { db } from "../firebase";
import { useStore } from "../useStore";

function Home() {
  const [index, setIndex] = useState(0);
  const { userData, setUserData, setUser } = useStore();
  const [groups, setGroups] = useState(null);
  const [inCall, setInCall] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async (loggedInUser) => {
      setUser(loggedInUser);
      const userData = (await getDoc(doc(db, "users", loggedInUser.uid))).data();
      setUserData(userData);

      const q = query(
        collection(db, "groups"),
        where("__name__", "in", [...userData.groups, "temp"])
      );
      const groupObjects = (await getDocs(q)).docs;
      setGroups(groupObjects);
    };

    const loggedInUser = localStorage.getItem("user");

    if (loggedInUser) {
      getUserData(JSON.parse(loggedInUser));
    } else {
      navigate("/");
    }
  }, []);

  return (
    <>
      {groups ? (
        <>
          <SideNavigation groups={groups} setGroups={setGroups} index={index} setIndex={setIndex} />
          {inCall ? (
            <VideoCall style={{ height: "100%" }} setInCall={setInCall} />
          ) : (
            <Calender group={groups.length !== 0 ? groups[index] : null} index={index} />
          )}
          <Button onClick={() => setInCall(true)}>Join Call</Button>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Home;
