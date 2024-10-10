import React from "react";
import Datatable from "./table";
import { firebaseConfig } from "@/lib/firebase";

async function getAllWorkReports() {
  const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/workReports?key=${firebaseConfig.apiKey}`;

  let allDocuments: any = [];
  let pageToken = "";
  const pageSize = 100; // Fetch 100 documents per request

  // Loop to handle pagination
  while (true) {
    const response = await fetch(
      `${url}&pageSize=${pageSize}${
        pageToken ? `&pageToken=${pageToken}` : ""
      }`,
      {
        next: { revalidate: 5300 }, // 1:30 hours in seconds
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch work reports");
    }

    const data = await response.json();

    // Extract documents and push them to the allDocuments array
    const documents = data.documents.map((doc: any) => ({
      id: doc.name.split("/").pop(),
      ...Object.entries(doc.fields).reduce((acc: any, [key, value]: any) => {
        acc[key] = value[Object.keys(value)[0]];
        return acc;
      }, {}),
    }));

    allDocuments = [...allDocuments, ...documents]; // Append current documents

    // Check if there is a nextPageToken, else break the loop
    if (!data.nextPageToken) {
      break;
    }

    pageToken = data.nextPageToken; // Set the token for the next request
  }

  return allDocuments;
}

export default async function Page() {
  const result = await getAllWorkReports();

  return (
    <div>
      <Datatable result={result} />
    </div>
  );
}
