"use client";
import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_PT } from "material-react-table/locales/pt"; // Import Portuguese localization

export default function Datatable({ result }: any) {
  const columns = useMemo(
    () => [
      { accessorKey: "CS_AS_Code", header: "Área Sup.", enableHiding: true },
      { accessorKey: "CS_Ser_Num", header: "Secção" },
      { accessorKey: "Nome_Municipio", header: "Município" },
      { accessorKey: "Nome_Bairro_Aldeia", header: "Bairro" },
      {
        accessorKey: "Nome_Comuna_Distrito",
        header: "Comuna",
        enableHiding: true,
      }, // Hide column by default
      { accessorKey: "date", header: "Data de recolha" },
      { accessorKey: "sincronization", header: "Sinc. Servidor" },
      { accessorKey: "listings", header: "Listagens" },
      { accessorKey: "interviews", header: "Entrevistas" },

      {
        accessorKey: "constraints",
        header: "Constrangimentos",
        enableHiding: true,
      }, // Hide column by default
    ],
    []
  );

  // Optionally manage the table state
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    // Handle row selection change
    console.log("Row selection changed:", rowSelection);
  }, [rowSelection]);

  const table = useMaterialReactTable({
    columns,
    data: result,
    enableColumnOrdering: true, // Enable column reordering
    enableRowSelection: true, // Enable row selection
    enableColumnFilters: true, // Enable column filters
    enablePagination: true, // Enable pagination
    onRowSelectionChange: setRowSelection, // Update row selection state
    state: { rowSelection }, // Manage your own row selection state
    localization: MRT_Localization_PT, // Use Portuguese localization
    initialState: {
      columnVisibility: {
        constraints: false,
        Nome_Comuna_Distrito: false,
        CS_AS_Code: false,
      },
    }, //hide firstName column by default
    renderBottomToolbarCustomActions: () => (
      <div style={{ padding: "0 16px" }}>
        <strong>Total Listagens: </strong> {totals.listings} &nbsp;&nbsp;
        <strong>Total Entrevistas: </strong> {totals.interviews} &nbsp;&nbsp;
        <strong>Total de Equipas: </strong> {totals.uniqueTeams}
      </div>
    ),
  });

  // Dynamically calculate totals based on filtered rows
  const totals = useMemo(() => {
    const filteredRows = table.getPrePaginationRowModel().rows;
    const uniqueTeams = new Set(); // To track unique CS_AS_Code (teams)

    const totalData = filteredRows.reduce(
      (acc: { listings: number; interviews: number }, row: any) => {
        const rowData = row.original; // Access original data
        acc.listings += Number(rowData.listings) || 0;
        acc.interviews += Number(rowData.interviews) || 0;
        if (rowData.CS_AS_Code) {
          uniqueTeams.add(rowData.CS_AS_Code); // Add unique CS_AS_Code to the set
        }
        return acc;
      },
      { listings: 0, interviews: 0 }
    );

    return {
      listings: totalData.listings,
      interviews: totalData.interviews,
      uniqueTeams: uniqueTeams.size, // Total number of unique teams
    };
  }, [table.getPrePaginationRowModel().rows]);

  return <MaterialReactTable table={table} />;
}
