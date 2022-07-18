import React, { useReducer } from "react";
import {
  Button,
  Card,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
} from "reactstrap";
import timeSlots from "./timeSlots.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import Header from "./Header";

function Appointment() {
  // Reducer for multiple action on Appointment Booking
  const AppointmentReducer = (state, action) => {
    switch (action.type) {
      case "onDataChange": // On Input field data change
        return { ...state, [action._name]: action._value };
      case "bookAppointment": // Appointment Book functionality
        return {
          ...state,
          timeslots: state.timeslots.map((timeslot) => {
            if (timeslot.id !== state.slotId) {
              return timeslot;
            }
            return {
              ...timeslot,
              booked: true,
              Name: state.Name,
              contact: state.contact,
            };
          }),
        };
      case "cancelBookedAppointment": // Cancel Appointment functionality
        return {
          ...state,
          timeslots: state.timeslots.map((timeslot) => {
            if (timeslot.id !== state.slotId) {
              return timeslot;
            }
            return {
              ...timeslot,
              booked: false,
              Name: "",
              contact: "",
            };
          }),
        };
      case "closeAddBookingModal": // Close modal after Appointment Booked
        return {
          ...state,
          bookingModalFlag: "closed",
          slotId: null,
          Name: "",
          contact: "",
        };
      case "openBookingAppointmentModal": // Open Booking Appointment modal for adding data
        return {
          ...state,
          bookingModalFlag: "opened",
          slotId: action.slotId,
        };
      case "closeUpdateModal": // Close modal after Updating Appointment
        return {
          ...state,
          updateModalFlag: "closed",
          slotId: null,
          Name: "",
          contact: "",
        };
      case "openUpdateModal": // Open modal for Updating Appointment
        const { Name, contact } = state.timeslots.find(
          ({ id }) => id === action.slotId
        ) || { Name: "y", contact: "u" };
        return {
          ...state,
          updateModalFlag: "opened",
          slotId: action.slotId,
          Name,
          contact,
        };
      default:
        return state;
    }
  };

  // Used React hook : useReducer for handling events in Appointment booking system
  const [state, dispatch] = useReducer(AppointmentReducer, {
    timeslots: timeSlots,
    bookingModalFlag: "closed",
    updateModalFlag: "closed",
    Name: "",
    contact: "",
    slotId: null,
  });

  const { bookingModalFlag, updateModalFlag, Name, contact, timeslots } = state;
  // All functions will Dispatch action with payload
  function oncloseAddBookingModal(e) {
    dispatch({ type: "closeAddBookingModal" });
  }
  function onOpenBookingAppointmentModal(e) {
    const slotId = parseInt(e.target.getAttribute("timeSlot-id"), 10);
    dispatch({ type: "openBookingAppointmentModal", slotId });
  }
  function oncloseAddBookingModal() {
    dispatch({ type: "closeAddBookingModal" });
  }
  function onopenUpdateModal(e) {
    const slotId = parseInt(e.target.getAttribute("timeSlot-id"), 10);
    dispatch({ type: "openUpdateModal", slotId });
  }
  function oncloseUpdateModal() {
    dispatch({ type: "closeUpdateModal" });
  }

  function onInputChange(e) {
    dispatch({
      type: "onDataChange",
      _name: e.target.name,
      _value: e.target.value,
    });
  }
  function onbookAppointment(e) {
    e.preventDefault();
    if (Name === "") {
      alert("Please enter Name");
    } else if (contact === "") {
      alert("Please enter Contact");
    } else {
      dispatch({ type: "bookAppointment" });
      dispatch({ type: "closeAddBookingModal" });
    }
  }

  function cancelBookedAppointment(e) {
    e.preventDefault();
    dispatch({ type: "cancelBookedAppointment" });
    dispatch({ type: "closeUpdateModal" });
  }
  function onUpdateTimeSlot(e) {
    e.preventDefault();
    dispatch({ type: "bookAppointment" });
    dispatch({ type: "closeUpdateModal" });
  }
  return (
    <>
      <Header />

      <Container className="App">
        <Row>
          {timeslots.map(({ id, startTime, endTime, booked }) => {
            if (!booked) {
              return (
                <Col
                  md={{ size: 3, offset: 0 }}
                  sm={{ size: 3, offset: 0 }}
                  className="my-4"
                  key={id}
                >
                  <Card
                    body
                    key={id}
                    className="p-4 text-center appointment-card"
                  >
                    <CardTitle tag="h5">{`${startTime} - ${endTime}`}</CardTitle>
                    <Button
                      color="primary"
                      onClick={onOpenBookingAppointmentModal}
                      timeSlot-id={id}
                      className="text-center scheduleBtn btn"
                    >
                      Schedule
                    </Button>
                  </Card>
                </Col>
              );
            }
            return (
              <Col
                md={{ size: 3, offset: 0 }}
                sm={{ size: 3, offset: 0 }}
                className="my-4"
                key={id}
              >
                <Card
                  body
                  key={id}
                  color="danger"
                  outline
                  className="p-4 text-center appointment-booked-card"
                >
                  <CardTitle tag="h5">{`${startTime} - ${endTime}`}</CardTitle>
                  <Button
                    color="danger"
                    onClick={onopenUpdateModal}
                    timeSlot-id={id}
                    className="text-center scheduleBtn-booked btn"
                  >
                    Update
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>

        <Modal
          isOpen={bookingModalFlag === "opened"}
          toggle={oncloseAddBookingModal}
          className="bookingModal modal-lg modal-dialog modal-dialog-centered modal-dialog-zoom"
        >
          <ModalHeader toggle={oncloseAddBookingModal}>
            Please Enter Information
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={onbookAppointment}>
              <FormGroup>
                <Label for="Name">Name</Label>
                <Input
                  type="text"
                  name="Name"
                  id="Name"
                  placeholder="Full Name"
                  onChange={onInputChange}
                  value={Name}
                />
              </FormGroup>
              <FormGroup>
                <Label for="contact">Contact</Label>
                <Input
                  type="tel"
                  name="contact"
                  id="contact"
                  placeholder="1-(XXX)-(XXX)-XXXX"
                  onChange={onInputChange}
                  value={contact}
                />
              </FormGroup>
              <Button
                type="submit"
                color="primary"
                className="mx-1 btn btn-success"
                onClick={onbookAppointment}
              >
                Book Appointment
              </Button>
              <Button
                color="secondary"
                className="mx-1"
                onClick={oncloseAddBookingModal}
              >
                Cancel
              </Button>
            </Form>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={updateModalFlag === "opened"}
          toggle={oncloseUpdateModal}
          className="reviewingModal modal-lg modal-dialog modal-dialog-centered modal-dialog-zoom"
        >
          <ModalHeader toggle={oncloseUpdateModal}>
            Update Information.
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={onUpdateTimeSlot}>
              <FormGroup>
                <Label for="Name2">Name</Label>
                <Input
                  type="text"
                  name="Name"
                  id="Name2"
                  placeholder="Full Name"
                  onChange={onInputChange}
                  value={Name}
                />
              </FormGroup>
              <FormGroup>
                <Label for="contact2">Contact</Label>
                <Input
                  type="tel"
                  name="contact"
                  id="contact2"
                  placeholder="1-(XXX)-XXX-XXXX"
                  onChange={onInputChange}
                  value={contact}
                />
              </FormGroup>
              <Button
                type="submit"
                color="primary"
                className="mx-1 btn btn-success"
                onClick={onUpdateTimeSlot}
              >
                Update Information
              </Button>
              <Button
                color="danger"
                className="mx-1"
                onClick={cancelBookedAppointment}
              >
                Cancel Appointment
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </Container>
    </>
  );
}

export default Appointment;
