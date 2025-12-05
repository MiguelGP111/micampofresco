import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiGet } from "../services/api";

interface Producto {
  idproducto: number;
  nombre: string;
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
  apiGet<Producto[]>("/productos")
    .then((data) => setProductos(data))
    .catch(() => {
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    });
}, []);

  return (
    <div>
      <h1>Productos</h1>
      <ul>
        {productos.map((p) => (
          <li key={p.idproducto}>{p.nombre}</li>
        ))}
      </ul>
    </div>
  );
}
