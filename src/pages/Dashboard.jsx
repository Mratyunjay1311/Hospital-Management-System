import React, { useState } from "react";
import Cards from "../components/Cards/Cards";

function Dashboard() {

       const [patients, setPatients] = useState(() => {
      try {
        const data = localStorage.getItem('patients');
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    });
  return (
    <>
       <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">

        <Cards title="Total Patients" value={patients.length} />
        <Cards title="Appointments" value="45" />
        <Cards title="Revenue" value="₹25,000" />
         </div>
    </>
  )
}
export default Dashboard;