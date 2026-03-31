import React, { useEffect, useState } from "react";
import PatientForm from "../features/patients/Patientform";
import PatientList from "../features/patients/PatientList";

function Patient() {

   const [patients, setPatients] = useState(() => {
  try {
    const data = localStorage.getItem('patients');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
});
    useEffect(() => {
      
        localStorage.setItem('patients',JSON.stringify(patients))

    }, [patients])
    
    const addPatient = (patient) =>{
        setPatients([...patients,patient])
    }

    const deletePatient = (id) =>{
        setPatients(patients.filter(p => p.id !== id));
    }
  return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Patients</h1>

        <PatientForm addPatient={addPatient}/>
        <PatientList patients={patients} deletePatient={deletePatient}/>
    </div>

  )
}
export default Patient;