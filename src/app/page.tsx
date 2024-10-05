import React from "react";
import { SelectAs } from "./search-as/select-as";

const Page = async () => {
  return (
    <div className="max-w-screen-md mx-auto">
      <div className="p-4 py-8">
        <p className="text-center text-2xl font-bold">ÁREA DE SUPERVISÃO</p>
        <p className="text-center my-6">
          Por favor seleccione a sua área de supervisão para actualizar os dados
        </p>
        <div>
          <SelectAs />
        </div>
      </div>
    </div>
  );
};

export default Page;
