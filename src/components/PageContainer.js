import React from "react";

export default function PageContainer({ children, title }) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}
