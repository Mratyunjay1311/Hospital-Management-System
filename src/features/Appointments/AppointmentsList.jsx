import React from "react";
function AppointmentList({ appointments ,deleteAppointment}) {
  return (
    
   <div className="bg-white p-4 rounded-xl shadow-md">
       <h1 className="text-lg font-bold mb-3"> All Appointments</h1>

      {appointments.map((ap) => (
        <div key={ap.id}  className="flex justify-between items-center border-b py-3">
          <p className="font-semibold text-gray-800">{ap.patientName}</p>
          <p className="text-sm text-gray-500">{ap.date} at {ap.time}</p>
           <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-md" onClick={()=>deleteAppointment(ap.id)}>
              Delete
            </button>
        </div>
      ))}
   </div>

  );
}


export default AppointmentList