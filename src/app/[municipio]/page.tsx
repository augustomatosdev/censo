"use client";
import { useEffect, useState } from "react";
import { agentesbruta } from "@/lib/agentesbruta";
import Datatable from "../table";
import { sumbe } from "@/lib/definitivas/pauta_sumbe";

export default function Page() {
  const [result, setResult] = useState([]);

  useEffect(() => {
    // Move data processing to client-side
    const processedResult: any = findMatchingRecenseadores(sumbe, agentesbruta);
    setResult(processedResult);
  }, []);

  // Helper function to clean and normalize names
  function normalizeName(name: string | undefined): string {
    if (!name) {
      return "";
    }
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z\s]/g, "")
      .trim()
      .toLowerCase();
  }

  // Function to get first and last name from a full name 938500001
  function getFirstAndLastName(fullname: string | undefined): string {
    if (!fullname) {
      return "";
    }
    const nameParts = fullname.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts[nameParts.length - 1] || "";
    return `${firstName} ${lastName}`;
  }

  function findMatchingRecenseadores(data1: any[], data2: any[]): any[] {
    return data1.reduce((matches: any[], item1: any) => {
      const recenseadorName = getFirstAndLastName(item1?.Column2);
      const normalizedRecenseador = normalizeName(recenseadorName);

      const match = data2.find((item2: any) => {
        const fullname = getFirstAndLastName(item2.fullname);
        const normalizedFullname = normalizeName(fullname);
        return normalizedRecenseador === normalizedFullname;
      });

      if (match) {
        matches.push({
          ...item1,
          ...match,
        });
      }

      return matches;
    }, []);
  }

  return (
    <div>
      <Datatable result={result} />
    </div>
  );
}
