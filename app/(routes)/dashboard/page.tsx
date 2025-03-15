import React from "react";
import ImageUpload from "./_components/ImageUpload";

function Dashboard() {
  return (
    <div className="md:px-20 lg:px-40 xl:px-40">
      <h2 className="font-bold text-3xl">Convert wireframe to code</h2>
      <ImageUpload/>
    </div>
  );
}

export default Dashboard;
