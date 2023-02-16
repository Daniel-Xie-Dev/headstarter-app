import { Sidebar, Menu, MenuItem, SubMenu, menuClasses } from "react-pro-sidebar";

// import "react-pro-sidebar/dist/styles";
import "./SideNavigation.css";
// import copy from "copy-to-clipboard";
import React from "react";
import { useStore } from "../../useStore";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import { auth, db } from "../../firebase";

import GroupsIcon from "@mui/icons-material/Groups";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const themes = {
  light: {
    sidebar: {
      backgroundColor: "#ffffff",
      color: "#607489",
    },
    menu: {
      menuContent: "#fbfcfd",
      icon: "#0098e5",
      hover: {
        backgroundColor: "#c5e4ff",
        color: "#44596e",
      },
      disabled: {
        color: "#9fb6cf",
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: "#0b2948",
      color: "#8ba1b7",
    },
    menu: {
      menuContent: "#082440",
      icon: "#59d0ff",
      hover: {
        backgroundColor: "#00458b",
        color: "#b6c8d9",
      },
      disabled: {
        color: "#3e5e7e",
      },
    },
  },
};

function SideNavigation({ groups, setGroups, index, setIndex, setInCall }) {
  const { user, userData } = useStore();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [show, setShow] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupTitle, setGroupTitle] = useState("Group");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // const [joinModal, setJoinModal] = useState(false);
  // const [groupId, setGroupId] = useState("");
  // const [group, setGroup] = useState();
  // const [context, setContext] = useState(false);
  // const [xYPosistion, setXyPosistion] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  //   const hideContext = (event) => {
  //     setContext(false);
  //   };

  //   window.addEventListener("click", hideContext);

  //   return function cleanup() {
  //     window.removeEventListener("click", hideContext);
  //   };
  // }, []);

  // const showNav = (event, group) => {
  //   event.preventDefault();
  //   setGroup(group);
  //   setContext(false);
  //   const positionChange = {
  //     x: event.pageX,
  //     y: event.pageY,
  //   };
  //   setXyPosistion(positionChange);
  //   setContext(true);
  // };

  const menuItemStyles = {
    root: {
      fontSize: "16px",
      fontWeight: 600,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    subMenuContent: ({ level }) => ({
      backgroundColor: level === 0 ? hexToRgba(themes[theme].menu.menuContent, 1) : "transparent",
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, 1),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };
  useEffect(() => {
    const getMembers = async () => {
      const allUsers = (await getDocs(collection(db, "users"))).docs;
      let array = [];
      groups.map((group) => {
        array.push(
          allUsers.filter((Users) => {
            return Users.data().group === group.id;
          })
        );
      });
      setGroupMembers(array);
      setIsLoading(false);
    };
    // setGroupMembers([]);

    if (groups) {
      getMembers();
    }

    // console.log(groupMembers);
  }, [groups]);

  const signout = async () => {
    localStorage.setItem("user", null);
    await auth.signOut();
    navigate("/");
  };

  const addToSelected = (userObject) => {
    setSelected([...selected, userObject]);

    setUsers((current) => {
      return current.filter((User) => User.id !== userObject.id);
    });
  };

  const removeFromSelected = async (userObject) => {
    setUsers([...users, userObject]);
    setSelected((prevUser) => {
      return prevUser.filter((User) => User.id !== userObject.id);
    });
  };

  const getUsers = async () => {
    setShow(true);

    const q = query(collection(db, "users"), where("isAdmin", "!=", true));
    const response = (await getDocs(q)).docs;
    setUsers(
      response.filter((users) => {
        return users.data().group.length === 0;
      })
    );
  };

  const handleModalClose = () => {
    setShow(false);
    setIsEdit(false);
    setUsers([]);
    setSelected([]);
  };

  const handleCreateGroup = async () => {
    if (groupTitle.length === 0) return;

    const groupObject = {
      ownerId: user.uid,
      groupTitle: groupTitle,
      members: selected.map((user) => user.id),
    };

    let group = null;
    let array = [...groups];
    if (isEdit) {
      group = groups[editIndex];
      await updateDoc(doc(db, "groups", groups[editIndex].id), groupObject);
      array.splice(editIndex, 1);
    } else {
      group = await addDoc(collection(db, "groups"), groupObject);
    }

    const groupFirestore = await getDoc(doc(db, "groups", group.id));
    setGroups([groupFirestore, ...array]);

    selected.map(async (user) => {
      await updateDoc(doc(db, "users", user.id), {
        group: group.id,
      });
    });

    users.map(async (user) => {
      await updateDoc(doc(db, "users", user.id), {
        group: "",
      });
    });

    // await updateDoc(doc(db, "users", user.uid), { groups: arrayUnion(group.id) });
    // setUserData({ ...userData, groups: [...userData.groups, group.id] });

    setGroupTitle("");
    setUsers([]);
    setSelected([]);
    setIsEdit(false);
    setShow(false);
    // window.location.reload();
  };

  const editGroup = (index) => {
    setSelected(groupMembers[index]);
    setEditIndex(index);
    setGroupTitle(groups[index].data().groupTitle);
    getUsers();
    setIsEdit(true);
  };

  const deleteGroup = async (index) => {
    const groupToDelete = groups[index];

    const userQuery = query(collection(db, "users"), where("group", "==", groupToDelete.id));
    const userGroupDeleted = (await getDocs(userQuery)).docs;
    userGroupDeleted.map(async (User) => {
      await updateDoc(doc(db, "users", User.id), {
        group: "",
      });
    });

    const eventQuery = query(collection(db, "events"), where("groupId", "==", groupToDelete.id));
    const eventGroupDeleted = (await getDocs(eventQuery)).docs;
    eventGroupDeleted.map(async (Event) => {
      await deleteDoc(doc(db, "events", Event.id));
    });

    await deleteDoc(doc(db, "groups", groupToDelete.id));

    const newGroups = [...groups];
    newGroups.splice(index, 1);
    setSelected([]);
    setUsers([]);
    setGroups(newGroups);
  };

  const renderMembers = (index) => {
    const result = groupMembers[index].map((members) => {
      const data = members.data();
      // console.log(data);
      return (
        <MenuItem key={members.id} icon={<PersonIcon />}>
          {data.firstName}, {data.lastName}
        </MenuItem>
      );
    });

    // // // console.log(result);
    return result;
  };

  // const handleJoinGroup = async () => {
  //   if (groupId.length === 0) return;

  //   const group = await getDoc(doc(db, "groups", groupId));
  //   if (group.exists) {
  //     await updateDoc(doc(db, "groups", groupId), {
  //       users: arrayUnion(user.uid),
  //     });

  //     await updateDoc(doc(db, "users", user.uid), {
  //       groups: arrayUnion(groupId),
  //     });

  //     let inGroups = false;

  //     for (let i = 0; i < groups.length; i++) {
  //       if (groups[i].id === groupId) {
  //         inGroups = true;
  //         break;
  //       }
  //     }

  //     if (!inGroups) {
  //       setGroups([...groups, group]);
  //     }

  //     setGroupId("");
  //     setJoinModal(false);
  //   }
  // };

  return (
    <>
      {/* {context && (
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
      )} */}

      <Modal show={show}>
        <Modal.Header className="ModalTitle">
          <Modal.Title style={{ width: "100%" }}>
            <h4 className="ModalInputContainer">
              <input
                className="ModalInput"
                placeholder="Group Title"
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
              />
            </h4>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h4>Selected users: </h4>
          {selected.map((user, index) => {
            const data = user.data();
            return (
              <Button
                key={user.id}
                onClick={() => removeFromSelected(user)}
                style={{ padding: "10px", marginRight: "10px", fontSize: "14px" }}
              >{`${data.firstName}, ${data.lastName}`}</Button>
            );
          })}

          <h4>All users: </h4>
          {users.map((user, index) => {
            const data = user.data();
            return (
              <Button
                key={user.id}
                onClick={() => addToSelected(user)}
                style={{ padding: "10px", marginRight: "10px", fontSize: "14px" }}
              >{`${data.firstName}, ${data.lastName}`}</Button>
            );
          })}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" disabled={selected.length === 0} onClick={handleCreateGroup}>
            {isEdit ? "Save Group" : "Create Group"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* 
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
      </Modal> */}

      {
        <Sidebar
          rootStyles={{
            color: themes[theme].sidebar.color,
          }}
          breakPoint="lg"
          // width="350px"
          backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, 1)}
        >
          <div style={{ backgroundColor: "white", display: "flex", padding: "0px 20px" }}>
            <img
              src="https://www.theheadstarter.com/static/media/logo.ddf12db2.svg"
              alt=""
              className="SideLogo"
            />
          </div>

          <Menu transitionDuration={300} menuItemStyles={menuItemStyles}>
            {!isLoading && groups.length === groupMembers.length ? (
              userData.isAdmin ? (
                <>
                  <SubMenu defaultOpen label="Groups" icon={<GroupsIcon />}>
                    {groups.map((group, i) => {
                      return (
                        <SubMenu
                          key={userData.isAdmin ? group.id : groups[0].id}
                          icon={<WorkspacesIcon />}
                          onClick={() => setIndex(i)}
                          style={{ backgroundColor: i === index ? "white" : "transparent" }}
                          label={
                            userData.isAdmin ? group.data().groupTitle : groups[0].data().groupTitle
                          }
                        >
                          {renderMembers(i)}
                          <MenuItem icon={<EditIcon />} onClick={() => editGroup(i)}>
                            Edit Group
                          </MenuItem>
                          <MenuItem icon={<DeleteForeverIcon />} onClick={() => deleteGroup(i)}>
                            Delete Group
                          </MenuItem>
                        </SubMenu>
                      );
                    })}
                  </SubMenu>
                  <MenuItem icon={<AddBoxIcon />} onClick={getUsers}>
                    Create new group
                  </MenuItem>
                </>
              ) : groups[0] ? (
                <SubMenu
                  key={userData.isAdmin ? groups[0].id : groups[0].id}
                  icon={<WorkspacesIcon />}
                  onClick={() => setIndex(index)}
                  label={
                    userData.isAdmin ? groups[0].data().groupTitle : groups[0].data().groupTitle
                  }
                >
                  {renderMembers(0)}
                </SubMenu>
              ) : (
                <MenuItem icon={<GroupsIcon />}>Soon to announced!</MenuItem>
              )
            ) : (
              <></>
            )}
            <MenuItem icon={<MeetingRoomIcon />} onClick={() => setInCall(true)}>
              Join Meeting
            </MenuItem>
            <MenuItem icon={<AccountBoxIcon />}>Profile</MenuItem>
            <MenuItem icon={<LogoutIcon />} onClick={signout}>
              Sign out
            </MenuItem>
            {/* <MenuItem icon={<DarkModeIcon />}></MenuItem> */}
          </Menu>
        </Sidebar>
      }
    </>
  );
}

export default SideNavigation;
