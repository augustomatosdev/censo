import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

// Example data
const data = [
  {
    "Serial Number": "007179",
    "Código da AS": "070401001",
    Nome_Bairro_Aldeia: "Capuaca (Divo II)_Maca_Divo I(II)",
    RECENSEADOR: "Vívia Lassaleth C. Noy",
    fullname: "Vivia Noy",
    tel: 924675280,
    bi: "009307432KS049",
    SUPERVISOR: "Jaime J. V. Carlos",
    LONGITUDE: 15.0454639656277,
    LATITUDE: -11.8273491083067,
  },
  // Add more rows here as needed...
];

export default function Datatable({ result }: any) {
  // Define the columns using useMemo for performance optimization
  const columns = useMemo(
    () => [
      {
        accessorKey: "Serial Number",
        header: "Serial Number",
      },
      {
        accessorKey: "Código da AS",
        header: "Codigo da AS",
      },
      {
        accessorKey: "Nome_Bairro_Aldeia",
        header: "Nome Bairro Aldeia",
      },
      {
        accessorKey: "RECENSEADOR",
        header: "Recenseador",
      },
      {
        accessorKey: "fullname",
        header: "Full Name",
      },
      {
        accessorKey: "tel",
        header: "Telephone",
      },
      {
        accessorKey: "bi",
        header: "BI",
      },
      // Additional columns (hidden by default but can be shown by filtering)
      {
        accessorKey: "SUPERVISOR",
        header: "Supervisor",
        enableHiding: true, // Allow hiding this column
      },
      {
        accessorKey: "LONGITUDE",
        header: "Longitude",
        enableHiding: true, // Allow hiding this column
      },
      {
        accessorKey: "LATITUDE",
        header: "Latitude",
        enableHiding: true, // Allow hiding this column
      },
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
  });

  return <MaterialReactTable table={table} />;
}
