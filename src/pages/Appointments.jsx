import React, { useEffect, useState } from "react";
import AppointmentForm from "../features/Appointments/AppointmentForm";
import AppointmentList from "../features/Appointments/AppointmentsList";

function Appointment() {

  const [appointments,setAppointments] = useState(()=>{
    try {
      const data = localStorage.getItem('appointments')
      return data ? JSON.parse(data) : []
    } catch (error) {
      return []
    }
  })

  useEffect(()=>{
    localStorage.setItem('appointments',JSON.stringify(appointments))
  },[appointments])


     const [patients, setPatients] = useState(() => {
      try {
        const data = localStorage.getItem('patients');
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    });

    const addAppointment = (appointment) =>{
        setAppointments(prev=>[...prev,appointment])
    }

    const deleteAppointment = (id)=>{
      setAppointments(prev=>prev.filter(a=>a.id !==id))
    }
  return(
    <>
    <AppointmentForm patients={patients} addAppointment={addAppointment}
    appointments={appointments}
    />

    <AppointmentList appointments={appointments} deleteAppointment={deleteAppointment}/>
    </>
  )
}
export default Appointment;