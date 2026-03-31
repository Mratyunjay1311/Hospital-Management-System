import React, { useState } from "react";

function PatientForm({addPatient}){

    const [name,setName] = useState('')
    const [age,setAge] = useState('')

    const handleSubmit = (e)=>{
        e.preventDefault()

        const newPatient = {
            id:Date.now(),
            name,
            age
        }

        addPatient(newPatient)

        setAge('')
        setName('')
    }
    return (
        <>
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md mb-4">

        <h2 className="text-lg font-bold mb-3">Add Patient</h2>

        <input type="text" placeholder="Enter Name" value={name} onChange={(e)=>setName(e.target.value)} className="border p-2 w-full mb-2 rounded"/>

         <input type="text" placeholder="Enter Age" value={age} onChange={(e)=>setAge(e.target.value)} className="border p-2 w-full mb-2 rounded"/>

             <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Patient
      </button>
        </form>
        </>
    )
}

export default PatientForm