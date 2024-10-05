import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { cassongueUploadFb } from "./cassongue";

export const bulkAddToFirebase = async (dataArray: []) => {
  const collectionRef = collection(db, "seccoes"); // replace with your collection name

  const promises = dataArray.map(async (data) => {
    try {
      const docRef = await addDoc(collectionRef, data);
      console.log(`Document added with ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  });

  await Promise.all(promises);
  console.log("done bro!");
};

export async function updateFirestoreWithAdditionalFields() {
  // Loop through each object in the array
  for (const obj of cassongueUploadFb) {
    try {
      // Query Firestore for documents with the matching Series-Numero
      const q = query(
        collection(db, "seccoes"),
        where("Series-Numero", "==", obj["Series-Numero"])
      );

      const querySnapshot = await getDocs(q);

      // If matching documents are found, update them with the additional fields
      querySnapshot.forEach(async (docSnapshot) => {
        const docRef = doc(db, "seccoes", docSnapshot.id);

        await updateDoc(docRef, {
          fullname: obj.fullname,
          bi: obj.bi,
          county: obj.county,
          tel: obj.tel,
          email: obj.email,
          iban: obj.iban,
        });

        console.log(
          `Document with Series-Numero ${obj["Series-Numero"]} updated successfully!`
        );
      });
    } catch (error) {
      console.error(
        `Error updating document with Series-Numero ${obj["Series-Numero"]}: `,
        error
      );
    }
  }
}
