import React, { useState } from "react";
import { useEffect } from "react";
const doctors = [
  {
    id: 1,
    name: "Dr. Sharma",
    slots: ["10:00", "11:00", "12:00"]
  },
  {
    id: 2,
    name: "Dr. Mishra",
    slots: ["14:00", "15:00", "16:00"]
  }
];

function AppointmentForm({patients,addAppointment,appointments,editingAppointment,
  updateAppointment}){

    const [selectedPatient,setSelectedPatient] = useState('')
   const [selectedDate, setSelectedDate] = useState("");
    const [time,setTime] = useState('')
     const [error, setError] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
const [selectedSlot, setSelectedSlot] = useState("");

useEffect(() => {
  if (editingAppointment) {
    setSelectedPatient(editingAppointment.patientId);
    setSelectedDoctor(editingAppointment.doctorId);
    setSelectedSlot(editingAppointment.slot);
    setSelectedDate(editingAppointment.date);
  }
}, [editingAppointment]);

const selectedDoc = doctors.find(
  (doc) => doc.id === Number(selectedDoctor)
);

    const handleSubmit = (e)=>{
        e.preventDefault()

const patient = patients.find(p=>p.id==selectedPatient)



 const newAppointment = {
  id: Date.now(),
  patientId: patient.id,
  patientName: patient.name,
  doctorId: Number(selectedDoctor),
  slot: selectedSlot,
  date: selectedDate,
};

 if (!selectedDoctor || !selectedSlot || !selectedDate || !selectedPatient) {
  setError("Please fill all fields");
  return;
}
  const isConflict = appointments.some(
    (appt) =>
      appt.doctorId === Number(selectedDoctor) &&
      appt.slot === selectedSlot &&
      appt.date === selectedDate
  );
   if(isConflict){
    setError("This time slot is already booked")
      setDate("");
    setTime("");

    return
   }

   if (editingAppointment) {
  updateAppointment({
    ...newAppointment,
    id: editingAppointment.id
  });
} else {
  addAppointment(newAppointment);
}

    setSelectedPatient("");
    setDate("");
    setTime("");

    }
    return(
        <>

   

        <form className="bg-white p-4 rounded-xl shadow-md mb-4" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-1">Book Appointment</h2>

         {error && (
        <p className="bg-red-100 text-red-600 p-2 rounded mb-2">
          {error}
        </p>
      )}

        <select name="" value={selectedPatient} id="" onChange={(e)=>setSelectedPatient(e.target.value)}  className="border p-2 w-full mb-2 rounded">
            <option value="">Select Patient</option>
            {patients.map(p=>(
                <option value={p.id} key={p.id}>
                    {p.name}
                </option>
            ))}
        </select>

 <select
  className="border p-2 rounded w-full"
  value={selectedDoctor}
  onChange={(e) => {
    setSelectedDoctor(e.target.value);
    setSelectedSlot("");
  }}
>
  <option value="">Select Doctor</option>
  {doctors.map((doc) => (
    <option key={doc.id} value={doc.id}>
      {doc.name}
    </option>
  ))}
</select>

              <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
<div className="grid grid-cols-3 gap-3 mt-4">
  {selectedDoc?.slots.map((slot) => {
    const isBooked = appointments.some(
      (appt) =>
        appt.doctorId === Number(selectedDoctor) &&
        appt.slot === slot &&
        appt.date === selectedDate
    );

    return (
      <button
        type="button"
        key={slot}
        disabled={isBooked}
        onClick={() => setSelectedSlot(slot)}
        className={`p-2 rounded border
          ${isBooked ? "bg-red-300 cursor-not-allowed" : ""}
          ${selectedSlot === slot ? "bg-blue-500 text-white" : "bg-gray-100"}
        `}
      >
        {slot}
      </button>
    );
  })}
</div>

       <button className="bg-blue-600 text-white px-4 py-2 rounded">
  {editingAppointment ? "Update Appointment" : "Book Appointment"}
</button>
        </form>
        </>
    )
}

export default AppointmentForm