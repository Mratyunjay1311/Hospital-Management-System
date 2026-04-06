import React, { useState } from "react";

function AppointmentForm({patients,addAppointment,appointments}){

    const [selectedPatient,setSelectedPatient] = useState('')
    const [date,setDate] = useState('')
    const [time,setTime] = useState('')

    const handleSubmit = (e)=>{
        e.preventDefault()

const patient = patients.find(p=>p.id==selectedPatient)

  const newAppointment = {
      id: Date.now(),
      patientId: patient.id,
      patientName: patient.name,
      date,
      time
    };

    if (!selectedPatient || !date || !time) {
  alert("Please fill all fields");
  return;
}

   const isConflict = appointments.some((a)=>a.date === date && a.time == time)
 
   if(isConflict){
    alert("Slot already booked")
      setDate("");
    setTime("");

    return
   }

     addAppointment(newAppointment);

    setSelectedPatient("");
    setDate("");
    setTime("");

    }
    return(
        <>
        <form className="bg-white p-4 rounded-xl shadow-md mb-4" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-1">Book Appointment</h2>

        <select name="" value={selectedPatient} id="" onChange={(e)=>setSelectedPatient(e.target.value)}  className="border p-2 w-full mb-2 rounded">
            <option value="">Select Patient</option>
            {patients.map(p=>(
                <option value={p.id} key={p.id}>
                    {p.name}
                </option>
            ))}
        </select>
        
              <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

   <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Book
      </button>
        </form>
        </>
    )
}

export default AppointmentForm