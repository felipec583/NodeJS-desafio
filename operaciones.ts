import fs from "fs";
import * as fsp from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const commands = process.argv.slice(2);
const [command, nombre, edad, animal, color, enfermedad] = commands;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface IObjectKeys {
  [key: string]: string;
}

interface AppointmentData extends IObjectKeys {
  nombre: string;
  edad: string;
  animal: string;
  color: string;
  enfermedad: string;
}

async function readAppointment() {
  try {
    const checkFile = await checkFileExists();
    if (checkFile) {
      const data = await fsp.readFile(
        path.join(__dirname, "citas.json"),
        "utf-8"
      );
      console.log(data);
    } else {
      console.log(
        "El archivo no existe, para crearlo escribe node index.js crear citas.json"
      );
    }
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
}

async function updateAppointmentDB() {
  try {
    const file = await fsp.readFile(
      path.join(__dirname, "citas.json"),
      "utf-8"
    );
    const data = JSON.parse(file);
    const updatedDB = updateObject(data);

    if (updatedDB === undefined) {
      console.error(
        "Debes escribir cinco campos: nombre, edad, animal, color, enfermedad"
      );
      return;
    }

    fs.writeFileSync(
      path.join(__dirname, "citas.json"),
      JSON.stringify(updatedDB)
    );
    console.log("Registrado");
  } catch (error) {
    console.log(error);
  }
}

async function checkFileExists() {
  try {
    const checkFile = await fsp
      .access("./citas.json", fsp.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (checkFile) return true;
    else {
  
    }
  } catch (error) {
    console.error(error);
  }
}

async function createJSONfile() {
  try {
  } catch {}
}

function runCommand() {
  try {
    switch (command) {
      case "leer":
        readAppointment();
        break;
      case "registrar":
        updateAppointmentDB();
        break;
      case "crear citas.json":
        createJSONfile();
        break;
      default:
        console.error(`${command} no existe, intenta con leer o registrar`);
    }
  } catch (error) {
    console.log(error);
  }
}

function updateObject(
  data: [] | AppointmentData[]
): AppointmentData[] | [] | void {
  const updatedData = [...data];

  const newData: AppointmentData = {
    nombre: nombre,
    edad: edad,
    animal: animal,
    color: color,
    enfermedad: enfermedad,
  };

  for (const key in newData) {
    if (newData[key] === undefined) {
      return;
    }
  }

  return [...updatedData, newData];
}

export default runCommand;
