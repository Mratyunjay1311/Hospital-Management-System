import React from "react";
const doctors = [
  { id: 1, name: "Dr. Sharma" },
  { id: 2, name: "Dr. Mishra" }
];
function AppointmentList({ appointments ,deleteAppointment}) {
  return (
    
   <div className="bg-white p-4 rounded-xl shadow-md">
       <h1 className="text-lg font-bold mb-3"> All Appointments</h1>

    {appointments.map((appt) => {
  const doctor = doctors.find(
    (doc) => doc.id === appt.doctorId
  );

  return (
    <div key={appt.id} className="bg-white p-4 rounded-xl shadow mb-3">
      
      <p className="font-bold">{appt.patientName}</p>

      <p className="text-blue-600">
        {doctor ? doctor.name : "Unknown Doctor"}
      </p>

      <p className="text-gray-500 text-sm">
        {appt.date} • {appt.slot}
      </p>

      <button
  onClick={() => setEditingAppointment(appt)}
  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
>
  Edit
</button>

    </div>
  );
})}
   </div>

  );
}


export default AppointmentList