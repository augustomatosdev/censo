"use client";
import * as React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CS } from "../../../types";
import Link from "next/link";

export function SelectAs() {
  const [input, setInput] = React.useState<string>(""); // State to track the input value
  const [foundCS, setFoundCS] = React.useState<CS[] | null>(null); // State to track the found CS
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false); // State to control dialog open/close

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  // Search for the CS_AS_Code in Firestore
  const handleSearch = async () => {
    console.log({ input });
    const collectionRef = collection(db, "seccoes"); // Replace with your Firestore collection name
    const q = query(collectionRef, where("CS_AS_Code", "==", input)); // Query based on input value
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const documents: CS[] = [];
      querySnapshot.forEach((doc) => {
        documents.push(doc.data() as any);
      });
      setFoundCS(documents); // Set the found CS data
      setDialogOpen(true); // Open the dialog
    } else {
      alert("Área de supervisão não encontrada!"); // Show alert if not found
    }
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFoundCS(null); // Reset the found CS
  };

  return (
    <div>
      <p className="my-4 text-xs">
        Introduza abaixo o código da sua área de supervisão
      </p>
      <TextField
        fullWidth
        label="Código da área de supervisão"
        placeholder="Ex. 070101000"
        variant="outlined"
        value={input}
        onChange={handleInputChange} // Update the input value
      />
      <div className="my-8 flex justify-center">
        <Button variant="contained" onClick={handleSearch}>
          Pesquisar área de supervisão
        </Button>
      </div>

      {/* Dialog to show the found CS data */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Área de Supervisão Encontrada</DialogTitle>
        <DialogContent>
          {foundCS && (
            <div>
              <p>
                <strong>Código:</strong> {foundCS[0].CS_AS_Code}
              </p>
              <p>
                <strong>Município:</strong> {foundCS[0].Nome_Municipio}
              </p>
              <p>
                <strong>Comuna/Distrito:</strong>{" "}
                {foundCS[0].Nome_Comuna_Distrito}
              </p>
              <p>
                <strong>Bairro/Aldeia:</strong> {foundCS[0].Nome_Bairro_Aldeia}
              </p>
              <p>
                <strong>Secções sencitárias:</strong>{" "}
                {foundCS.map((item, key) => (
                  <span key={key}>{item.CS_Ser_Num}, </span>
                ))}
              </p>
              {/* Add any other fields you want to display */}
            </div>
          )}
        </DialogContent>
        <DialogActions className="p-4">
          <Button size="small" onClick={handleCloseDialog} color="error">
            CANCELAR
          </Button>
          {foundCS && (
            <Button
              size="small"
              variant="contained"
              onClick={handleCloseDialog}
              color="primary"
              LinkComponent={Link}
              href={`/as/${foundCS[0].CS_AS_Code}`}
            >
              ACTUALIZAR DADOS
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
