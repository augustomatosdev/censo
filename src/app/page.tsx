"use client";
import Link from "next/link";
import { updateFirestoreWithAdditionalFields } from "@/lib/uploadfb/addToFirebase";

export default function Home() {
  const municipios = [
    "porto_amboim",
    "sumbe",
    "seles",
    "conda",
    "amboim",
    "quilenda",
    "libolo",
    "mussende",
    "quibala",
    "ebo",
    "cela",
    "cassongue",
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center">
        SELECCIONE O SEU MUNICIPIO
      </h1>
      <div>
        {municipios.map((el, key) => (
          <Link
            key={key}
            href={`/${el}`}
            className={`m-8 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
          >
            {el}
          </Link>
        ))}
      </div>
      <div>
        <button onClick={() => updateFirestoreWithAdditionalFields()}>
          addData
        </button>
      </div>
    </div>
  );
}
