import React from "react";

function Cards({title,value}){
    return(
        <div className="bg-white border-l-4 border-blue-600 p-4 rounded-xl shadow-md">

             <h3 className="text-gray-500">{title}</h3>
      <h1 className="text-2xl font-bold mt-2">{value}</h1>

        </div>
    )
}

export default Cards