import React, { useEffect, useState } from "react";
import axiosAuthInstance from "../../auth/interceptor";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Button, Link } from "@material-ui/core";

const EventosList = () => {
  const [eventos, setEventos] = useState([]);

  const getEventos = async () => {
    const resp = await axiosAuthInstance.get(
      "http://172.24.98.148:8080/eventos"
    );
    setEventos(resp.data);
  };

  useEffect(() => {
    getEventos();
  }, []);
  return (
    <div>
      <Button variant="contained" color="primary" href="/eventos/create">
        Crear evento
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Presencial</TableCell>
              <TableCell>Lugar</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventos.map((evento, index) => (
              <TableRow
                component={Link}
                href={"/eventos/" + evento.id}
                key={index}
              >
                <TableCell>{evento.id}</TableCell>
                <TableCell>{evento.nombre}</TableCell>
                <TableCell>{evento.categoria}</TableCell>
                <TableCell>
                  {evento.presencial ? "presencial" : "virtual"}
                </TableCell>
                <TableCell>{evento.lugar}</TableCell>
                <TableCell>{evento.direccion}</TableCell>
                <TableCell>{evento.fecha_inicio}</TableCell>
                <TableCell>{evento.fecha_fin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EventosList;
