import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axiosAuthInstance from "../../auth/interceptor";
import { Button } from "@material-ui/core";

const EventoDetail = () => {
  const [evento, setEvento] = useState({
    nombre: "",
    categoria: "conferencia",
    lugar: "",
    direccion: "",
    presencial: false,
    fecha_inicio: new Date().toISOString().split("T")[0],
    fecha_fin: new Date().toISOString().split("T")[0],
  });

  const router = useRouter();

  const [id, setId] = useState();

  const getEvento = async () => {
    if (!id) return;
    const resp = await axiosAuthInstance.get(
      "http://localhost:5000/eventos/" + id
    );
    setEvento(resp.data);
    console.log(resp);
  };

  const deleteEvento = async () => {
    await axiosAuthInstance.delete("http://localhost:5000/eventos/" + id);
    window.location = "/eventos";
  };

  useEffect(() => {
    getEvento();
  }, [id]);

  useEffect(() => {
    if (router.asPath !== router.route) {
      setId(router.query.id);
    }
  }, [router]);

  const goToUpdate = () => {
    let { id } = router.query;
    while (!id) {
      id = router.query.id;
    }
    window.location = "/eventos/" + id + "/update";
  };

  return (
    <div>
      <h2>{evento.nombre}</h2>
      <p>Id: {evento.id}</p>
      <p>Categoria: {evento.categoria}</p>
      <p>Presencial: {evento.presencial ? "presencial" : "virtual"}</p>
      <p>Lugar: {evento.lugar}</p>
      <p>Dirección: {evento.direccion}</p>
      <p>Fecha inicio: {evento.fecha_inicio}</p>
      <p>Fecha fin: {evento.fecha_fin}</p>
      <Button variant="contained" color="primary" onClick={goToUpdate}>
        Actualizar
      </Button>
      <Button variant="contained" color="secondary" onClick={deleteEvento}>
        Eliminar
      </Button>
    </div>
  );
};

export default EventoDetail;
