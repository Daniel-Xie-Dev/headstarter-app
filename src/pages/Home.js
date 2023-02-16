import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore/lite";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calender from "../components/Calender/Calender";
import SideNavigation from "../components/SideNavigation/SideNavigation";
import { db } from "../firebase";
import { useStore } from "../useStore";
import { Button } from "@mui/material";
import "./Home.css";

function Home() {
  const [index, setIndex] = useState(0);
  const { user, setUserData, setUser } = useStore();
  const [groups, setGroups] = useState(null);
  const [inCall, setInCall] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async (loggedInUser) => {
      setUser(loggedInUser);
      const userData = (await getDoc(doc(db, "users", loggedInUser.uid))).data();
      setUserData(userData);

      if (userData.isAdmin) {
        const groupObjects = (await getDocs(collection(db, "groups"))).docs;
        setGroups(groupObjects);
      } else {
        if (userData.group.length > 0) {
          const groupObjects = await getDoc(doc(db, "groups", userData.group));
          if (groupObjects.data().members.indexOf(loggedInUser.uid) === -1) {
            await updateDoc(doc(db, "user", loggedInUser.uid), { group: "" });
            setGroups([]);
          } else {
            setGroups([groupObjects]);
          }
        } else {
          setGroups([]);
        }
      }
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
          <SideNavigation
            groups={groups}
            setGroups={setGroups}
            index={index}
            setIndex={setIndex}
            setInCall={setInCall}
          />

          <div className="DisplayContainer">
            {inCall ? (
              <></>
            ) : (
              <Calender group={groups.length !== 0 ? groups[index] : null} index={index} />
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Home;
