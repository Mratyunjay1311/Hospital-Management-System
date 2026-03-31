import React from "react";

function PatientList({patients,deletePatient}){



    return(
       <div className="bg-white p-4 rounded-xl shadow-md">

  <h2 className="text-lg font-bold mb-3">Patient List</h2>

  {patients.map((p)=>(
    <div className="flex justify-between items-center border-b py-2" key={p.id}>
        <div>
            <p className="font-semibold">{p.name}</p>
            <p className="text-sm text-gray-500">Age: {p.age}</p>
        </div>
           <button 
            onClick={() => deletePatient(p.id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
    </div>
    
  ))}
       </div>
    )
}


export default PatientList