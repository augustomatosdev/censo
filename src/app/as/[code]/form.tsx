"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore"; // Firestore
import { CS } from "../../../../types";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export const Form = ({ data }: { data: CS[] }) => {
  const router = useRouter();
  const [date, setDate] = useState<string>(""); // State for the date of collection
  const [workData, setWorkData] = useState(
    data.map((item) => ({
      ...item,
      listings: "", // Track quantity of listings for each section
      interviews: "", // Track quantity of interviews for each section
    }))
  );
  const [constraints, setConstraints] = useState<string>(""); // State for constraints (optional)
  const [sincronization, setSincronization] = useState<string>("no");

  // Handler for the date input
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  // Handler for listings input (specific to each section)
  const handleListingsChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newWorkData = [...workData];
    newWorkData[index].listings = event.target.value;
    setWorkData(newWorkData);
  };

  // Handler for interviews input (specific to each section)
  const handleInterviewsChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newWorkData = [...workData];
    newWorkData[index].interviews = event.target.value;
    setWorkData(newWorkData);
  };

  // Handler for constraints input
  const handleConstraintsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConstraints(event.target.value);
  };

  // Validate form data
  const validateForm = () => {
    for (const section of workData) {
      if (!section.listings || !section.interviews) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return false;
      }
    }
    if (!date) {
      alert("Por favor, selecione uma data.");
      return false;
    }
    return true;
  };

  // Save or update the data to Firestore
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const collectionRef = collection(db, "workReports"); // Firestore collection for storing work reports

      for (const section of workData) {
        // Check if a report with the same CS_Ser_Num and date exists
        const q = query(
          collectionRef,
          where("CS_Ser_Num", "==", section.CS_Ser_Num),
          where("date", "==", date)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // If a document exists, update it
          const docRef = querySnapshot.docs[0].ref;
          await setDoc(
            docRef,
            {
              ...section,
              date,
              constraints,
              sincronization,
              updatedAt: new Date().toISOString(), // Add an update timestamp
            },
            { merge: true }
          );
        } else {
          // If no document exists, add a new one
          await addDoc(collectionRef, {
            ...section,
            date,
            constraints,
            sincronization,
            createdAt: new Date().toISOString(),
          });
        }
      }

      alert("Dados salvos com sucesso!");
      router.push("/search-as");
    } catch (error) {
      console.error("Erro ao salvar os dados: ", error);
      alert("Ocorreu um erro ao salvar os dados.");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <p className="my-2 font-bold">Seleccione a data da recolha</p>
        <div className="mb-4">
          <TextField
            fullWidth
            variant="outlined"
            type="date"
            value={date}
            onChange={handleDateChange} // Handle the date change
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="my-2 font-bold">Dados sincronizados?</p>
        <p className="text-xs">
          Os dados recolhidos no dia foram sincronizados com o servidor central?
        </p>
        <FormControl>
          <RadioGroup
            onChange={(e) => setSincronization(e.target.value)}
            value={sincronization}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label="Sim" />
            <FormControlLabel value="no" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>
      </div>

      {/* Iterate over each section and allow the user to input data */}
      {workData.map((section, index) => (
        <div className="mb-4" key={section.CS_Ser_Num}>
          <p className="my-2 font-bold">Secção: {section.CS_Ser_Num}</p>

          <div className="mb-4">
            <TextField
              fullWidth
              type="number"
              label="Quantidade de listagens"
              placeholder="Quantidade de listagens"
              variant="outlined"
              value={section.listings}
              onChange={(event) => handleListingsChange(index, event as any)} // Handle listings input
            />
          </div>

          <div className="mb-4">
            <TextField
              fullWidth
              type="number"
              label="Quantidade de entrevistas"
              placeholder="Quantidade de entrevistas"
              variant="outlined"
              value={section.interviews}
              onChange={(event) => handleInterviewsChange(index, event as any)} // Handle interviews input
            />
          </div>
        </div>
      ))}

      <div className="mb-4">
        <p className="my-2 font-bold">Principais constrangimentos (opcional)</p>
        <div className="mb-4">
          <TextField
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            value={constraints}
            onChange={handleConstraintsChange} // Handle constraints input
          />
        </div>
      </div>

      <div className="mb-4 flex justify-center">
        <Button variant="contained" onClick={handleSave}>
          Salvar Dados
        </Button>
      </div>
    </div>
  );
};
