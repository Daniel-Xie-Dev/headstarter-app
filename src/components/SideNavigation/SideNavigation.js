import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "./SideNavigation.css";
import copy from "copy-to-clipboard";
import React from "react";
import { useStore } from "../../useStore";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { addDoc, arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "../../firebase";
import { useEffect } from "react";

import GroupsIcon from "@mui/icons-material/Groups";
import AddBoxIcon from "@mui/icons-material/AddBox";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import WorkspacesIcon from "@mui/icons-material/Workspaces";

function SideNavigation({ groups, setGroups, index, setIndex }) {
  const { user, userData, setUserData } = useStore();
  const [show, setShow] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const [groupTitle, setGroupTitle] = useState("");
  const [groupId, setGroupId] = useState("");
  const [group, setGroup] = useState();

  // console.log(userData);
  const [context, setContext] = useState(false);
  const [xYPosistion, setXyPosistion] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const hideContext = (event) => {
      setContext(false);
    };

    window.addEventListener("click", hideContext);

    return function cleanup() {
      window.removeEventListener("click", hideContext);
    };
  }, []);

  const showNav = (event, group) => {
    event.preventDefault();
    setGroup(group);
    setContext(false);
    const positionChange = {
      x: event.pageX,
      y: event.pageY,
    };
    setXyPosistion(positionChange);
    setContext(true);
  };

  const handleCreateGroup = async () => {
    if (groupTitle.length === 0) return;

    const groupObject = {
      ownerId: user.uid,
      groupTitle: groupTitle,
      users: [],
      events: [],
    };
    const group = await addDoc(collection(db, "groups"), groupObject);

    await updateDoc(doc(db, "users", user.uid), { groups: arrayUnion(group.id) });
    setUserData({ ...userData, groups: [...userData.groups, group.id] });

    const groupFirestore = await getDoc(doc(db, "groups", group.id));

    setGroups([...groups, groupFirestore]);
    setGroupTitle("");
    setShow(false);
  };

  const handleJoinGroup = async () => {
    if (groupId.length === 0) return;

    const group = await getDoc(doc(db, "groups", groupId));
    if (group.exists) {
      await updateDoc(doc(db, "groups", groupId), {
        users: arrayUnion(user.uid),
      });

      await updateDoc(doc(db, "users", user.uid), {
        groups: arrayUnion(groupId),
      });

      let inGroups = false;

      for (let i = 0; i < groups.length; i++) {
        if (groups[i].id === groupId) {
          inGroups = true;
          break;
        }
      }

      if (!inGroups) {
        setGroups([...groups, group]);
      }

      setGroupId("");
      setJoinModal(false);
    }
  };

  return (
    <>
      {context && (
        <div style={{ top: xYPosistion.y, left: xYPosistion.x }} className="bg-primary rightClick">
          <div
            className="menuElement"
            onClick={() => {
              copy(group?.id);
              // alert(group?.id);
            }}
          >
            Copy Group Id
          </div>
        </div>
      )}

      <Modal show={show}>
        <Modal.Header className="ModalTitle">
          <Modal.Title>
            <h4 className="ModalInputContainer">
              <input
                className="ModalInput"
                placeholder="Group Title"
                onChange={(e) => setGroupTitle(e.target.value)}
              />
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateGroup}>
            Create Group
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={joinModal}>
        <Modal.Header className="ModalTitle">
          <Modal.Title>
            <h4 className="ModalInputContainer">
              <input
                className="ModalInput"
                placeholder="Paste Group Id Here"
                onChange={(e) => setGroupId(e.target.value)}
              />
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setJoinModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleJoinGroup}>
            Join Group
          </Button>
        </Modal.Footer>
      </Modal>
      <Sidebar>
        <Menu transitionDuration={500}>
          <SubMenu defaultOpen label="Groups" icon={<GroupsIcon />}>
            {groups.map((group, i) => {
              // console.log(index, i);
              return (
                <MenuItem
                  icon={<WorkspacesIcon />}
                  key={group.id}
                  onClick={() => setIndex(i)}
                  onContextMenu={(event) => showNav(event, group)}
                >
                  {group.data().groupTitle}
                </MenuItem>
              );
            })}
          </SubMenu>
          {/* <MenuItem icon={<AddBoxIcon />} onClick={() => setShow(true)}>
            Create new group
          </MenuItem>
          <MenuItem icon={<GroupAddIcon />} onClick={() => setJoinModal(true)}>
            Join a group
          </MenuItem> */}
          <MenuItem icon={<AccountBoxIcon />}>Profile</MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
}

export default SideNavigation;
