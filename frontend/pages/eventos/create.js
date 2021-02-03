import {
  TextField,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import React, { useState } from "react";
import axiosAuthInstance from "../../auth/interceptor";

const CreateEvento = () => {
  const [evento, setEvento] = useState({
    nombre: "",
    categoria: "conferencia",
    lugar: "",
    direccion: "",
    presencial: false,
    fecha_inicio: new Date().toISOString().split("T")[0],
    fecha_fin: new Date().toISOString().split("T")[0],
  });

  const handleNombreChange = (event) => {
    setEvento({ ...evento, nombre: event.target.value });
  };

  const handleCategoriaChange = (event) => {
    setEvento({ ...evento, categoria: event.target.value });
  };

  const handleLugarChange = (event) => {
    setEvento({ ...evento, lugar: event.target.value });
  };

  const handleDireccionChange = (event) => {
    setEvento({ ...evento, direccion: event.target.value });
  };

  const handlePresencialChange = (event) => {
    setEvento({ ...evento, presencial: event.target.checked });
  };

  const handleFechaInicioChange = (date) => {
    console.log(typeof date);
    setEvento({ ...evento, fecha_inicio: date.toISOString().split("T")[0] });
  };

  const handleFechaFinChange = (date) => {
    setEvento({ ...evento, fecha_fin: date.toISOString().split("T")[0] });
  };

  const create = async () => {
    console.log(evento);
    const resp = await axiosAuthInstance.post(
      "http://localhost:5000/eventos",
      evento
    );
    console.log(resp);
    window.location = "/eventos";
  };
  return (
    <div>
      <h2>Crear evento</h2>
      <form>
        <div>
          <TextField id="nombre" label="Nombre" onChange={handleNombreChange} />
        </div>
        <div>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={evento.categoria}
              onChange={handleCategoriaChange}
            >
              <MenuItem value={"conferencia"}>Conferencia</MenuItem>
              <MenuItem value={"seminario"}>Seminario</MenuItem>
              <MenuItem value={"congreso"}>Congreso</MenuItem>
              <MenuItem value={"curso"}>Curso</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <TextField id="lugar" label="Lugar" onChange={handleLugarChange} />
        </div>
        <div>
          <TextField
            id="direccion"
            label="Direccion"
            onChange={handleDireccionChange}
          />
        </div>
        <div>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={evento.presencial}
                  onChange={handlePresencialChange}
                  name="presencial"
                  color="primary"
                />
              }
              label="Presencial"
            />
          </FormGroup>
        </div>
        <div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="fecha-inicio"
              label="Fecha inicio"
              value={evento.fecha_inicio}
              onChange={handleFechaInicioChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="fecha-fin"
              label="Fecha fin"
              value={evento.fecha_fin}
              onChange={handleFechaFinChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
      </form>
      <Button variant="contained" color="primary" onClick={create}>
        Crear
      </Button>
    </div>
  );
};

export default CreateEvento;
