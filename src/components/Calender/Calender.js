import { Calendar, dateFnsLocalizer, momentLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import moment from "moment";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import React, { useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "./Calender.css";
import DateTimePicker from "react-datetime-picker";
import { Form } from "react-bootstrap";

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
        {moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}
      </span>
    </div>
  );
};

function Calender() {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState({
    id: null,
    title: "New Event",
    start: new Date(),
    end: new Date(),
    description: "",
  });
  //   console.log(event);
  const handleOpenSlot = (e) => {
    setShowModal(true);
    setEvent({ ...event, start: new Date(e.start), end: new Date(e.end) });
  };

  const saveEvent = () => {
    let object = { ...event };

    console.log(event.title);

    let array = [...events];
    if (object.id !== null) {
      let index = -1;
      for (let i = 0; i < array.length; i++) {
        if (array[i].id === object.id) {
          index = i;
          break;
        }
      }
      array.splice(index, 1);
    }

    object.id = object.id !== null ? object.id : events.length;

    setEvents([...array, object]);
    setShowModal(false);
    setEvent({
      id: null,
      title: "New Event",
      start: new Date(),
      end: new Date(),
      description: "",
    });
  };

  const editEvent = (event) => {
    setShowModal(true);

    setEvent({
      id: event.id,
      start: event.start,
      end: event.end,
      title: event.title,
      description: event.description,
    });
  };

  return (
    <>
      <Modal show={showModal}>
        <Modal.Header className="ModalTitle">
          <Modal.Title>{event.start.toLocaleDateString()} - </Modal.Title>
          <h4 className="ModalInputContainer">
            <input
              className="ModalInput"
              placeholder="Title Here"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
            ></input>
          </h4>
        </Modal.Header>
        <Modal.Body>
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
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={saveEvent}>
            Save Event
          </Button>
        </Modal.Footer>
      </Modal>

      <Calendar
        className="Calendar"
        localizer={localizer}
        selectable
        step={15}
        events={events}
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
  );
}

export default Calender;
