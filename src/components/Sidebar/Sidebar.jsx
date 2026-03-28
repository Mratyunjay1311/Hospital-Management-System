import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-60 h-screen bg-gray-900 text-white p-4">
      <ul className="space-y-4">

        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) =>
              isActive 
                ? "block bg-blue-600 px-3 py-2 rounded text-white" 
                : "block px-3 py-2 hover:bg-gray-700 rounded"
            }
          >
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/patients"
            className={({ isActive }) =>
              isActive 
                ? "block bg-blue-600 px-3 py-2 rounded text-white" 
                : "block px-3 py-2 hover:bg-gray-700 rounded"
            }
          >
            Patients
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/appointments"
            className={({ isActive }) =>
              isActive 
                ? "block bg-blue-600 px-3 py-2 rounded text-white"
                : "block px-3 py-2 hover:bg-gray-700 rounded"
            }
          >
            Appointments
          </NavLink>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;