import React from "react";
import { CS } from "../../../../types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Form } from "./form";

const Page = async ({ params }: { params: { code: string } }) => {
  const documents: CS[] = [];
  const collectionRef = collection(db, "seccoes");
  const q = query(collectionRef, where("CS_AS_Code", "==", params.code));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
      documents.push(doc.data() as any);
    });
  } else {
    alert("Área de supervisão não encontrada!");
  }

  return (
    <div className="max-w-screen-md mx-auto">
      <div className="p-4 py-8">
        <p className="text-center text-lg font-bold">
          ACTUALIZAR DADOS DA SUA ÁREA DE SUPERVISÃO - {params.code}
        </p>
        <p className="text-center my-6">
          Por favor introduza os dados de recolha em cada secção durante o dia
          de hoje
        </p>
        <Form data={documents} />
      </div>
    </div>
  );
};

export default Page;
