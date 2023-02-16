import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";

import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import React, { useState, useEffect } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import emailjs from "@emailjs/browser";

import {
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore/lite";

import "./Calender.css";
import DateTimePicker from "react-datetime-picker";
import { Form } from "react-bootstrap";
import { useStore } from "../../useStore";
import { db } from "../../firebase";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Event = ({ event }) => {
  return (
    <div>
      <span style={{ fontWeight: "bold" }}>{event.title}</span>
      <br />
      {/* <span>
        {moment(event.start).format("")} - {moment(event.end).format("HH:mm")}
      </span>
      <br /> */}
      <span>
        {/* {moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")} */}
      </span>

      <p>Description: {event.description}</p>
    </div>
  );
};

function Calender({ group, index }) {
  // console.log(group.id);
  // console.log(...group.data().events);
  const { user, userData } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [isEdit, setisEdit] = useState(false);
  const [event, setEvent] = useState({
    owner: user.uid,
    groupId: null,
    title: "",
    start: new Date(),
    end: new Date(),
    description: "",
  });

  const [sendEmail, setSendEmail] = useState(false);

  useEffect(() => {
    const getEvents = async () => {
      const response = (
        await getDocs(query(collection(db, "events"), where("groupId", "==", group.id)))
      ).docs;
      setEvents(response);
    };
    if (group) {
      getEvents();
    }
  }, [group]);

  const codeSnippet = () => {
    setShowModal(true);
    setSendEmail(false);
  };

  const handleOpenSlot = (e) => {
    codeSnippet();
    setisEdit(false);
    setEvent({
      ...event,
      groupId: group.id,
      owner: user.uid,
      start: new Date(e.start),
      end: new Date(e.end),
    });
  };

  const editEvent = (event) => {
    // if (event.owner !== user.uid) return;

    codeSnippet();
    setisEdit(true);

    // console.log(event);

    setEvent({
      id: event.id,
      groupId: event.groupId,
      owner: event.owner,
      start: event.start,
      end: event.end,
      title: event.title,
      description: event.description,
    });
  };

  const createEvent = async () => {
    let object = { ...event };
    object.start = Timestamp.fromDate(object.start);
    object.end = Timestamp.fromDate(object.end);

    if (isEdit) {
      const eventid = object.id;
      delete object.id;

      await updateDoc(doc(db, "events", eventid), object);
      const eventRef = await getDoc(doc(db, "events", eventid));

      setEvents([
        ...events.filter((event) => {
          return event.id !== eventid;
        }),
        eventRef,
      ]);
    } else {
      const eventObject = await addDoc(collection(db, "events"), object);

      const eventRef = await getDoc(doc(db, "events", eventObject.id));
      setEvents([...events, eventRef]);
    }

    if (sendEmail) {
      const q = query(collection(db, "users"), where("group", "==", group.id));
      const users = (await getDocs(q)).docs;

      for (let i = 0; i < users.length; i++) {
        const data = users[i].data();
        await emailjs.send(
          "service_wldz34v",
          "template_oxu3hfg",
          { to_email: data.email, to_name: data.firstName },
          "0IE8w6KTDDIxWgk0g"
        );
      }
    }

    setShowModal(false);
    setEvent({
      owner: null,
      groupId: group.id,
      title: "",
      start: new Date(),
      end: new Date(),
      description: "",
    });
  };

  const deleteEvent = async () => {
    try {
      const eventId = event.id;
      await deleteDoc(doc(db, "events", eventId));
      await updateDoc(doc(db, "groups", group.id), {
        events: arrayRemove(eventId),
      });
      removeFromEvents(eventId);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromEvents = (eventId) => {
    // console.log(events.filter((event) => event.id !== eventId));
    setEvents((events) => {
      return events.filter((event) => event.id !== eventId);
    });
  };

  return (
    <>
      {group ? (
        <>
          <Modal show={showModal} className="Modal">
            <Modal.Header className="ModalTitle">
              <Modal.Title>
                {event.start !== null ? event.start.toLocaleDateString() : null}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4 className="ModalInputContainer">
                <input
                  className="ModalInput"
                  placeholder="Title Here"
                  value={event.title}
                  onChange={(e) => setEvent({ ...event, title: e.target.value })}
                ></input>
              </h4>
              <h5>Start Date & Time:</h5>
              <DateTimePicker
                className="DateTimeInput"
                disableClock
                value={event.start}
                onChange={(e) => setEvent({ ...event, start: e })}
              />
              <h5>End Date & Time:</h5>
              <DateTimePicker
                className="DateTimeInput"
                disableClock
                value={event.end}
                onChange={(e) => setEvent({ ...event, end: e })}
              />

              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={event.description}
                  onChange={(e) => setEvent({ ...event, description: e.target.value })}
                />

                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Notify group members about event?"
                  onClick={() => setSendEmail(!sendEmail)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              {isEdit && (userData.isAdmin || event.owner === user.uid) ? (
                <Button variant="warning" onClick={deleteEvent}>
                  Remove Event
                </Button>
              ) : (
                <></>
              )}

              {event.owner === user.uid || userData.isAdmin ? (
                <Button variant="primary" onClick={createEvent}>
                  Save Event
                </Button>
              ) : (
                <></>
              )}
            </Modal.Footer>
          </Modal>

          <Calendar
            className="Calendar"
            localizer={localizer}
            selectable
            step={15}
            events={events.map((event, index) => {
              const data = event.data();
              console.log(data);
              const object = {
                id: event.id,
                owner: data.owner,
                groupId: data.groupId,
                start: data.start.toDate(),
                end: data.end.toDate(),
                title: data.title,
                description: data.description,
              };
              // console.log(object);
              return object;
            })}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100vh" }}
            onSelectSlot={(event) => {
              handleOpenSlot(event);
            }}
            onSelectEvent={(event) => editEvent(event)}
            components={{
              event: Event,
            }}
          />
        </>
      ) : (
        <h4
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Please wait until you are assigned a group
        </h4>
      )}
    </>
  );
}

export default Calender;
