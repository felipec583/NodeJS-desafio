import readline from "readline";
import * as fsp from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const commands = process.argv.slice(2);
const [
  command,
  firstArgument,
  secondArgument,
  thirdArgument,
  fourthArgument,
  fifthArgument,
] = commands;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface(process.stdin, process.stdout);

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
      console.log(JSON.stringify(JSON.parse(data), null, " "));
      rl.close();
    } else {
      console.log(
        "El archivo no existe, para crearlo escribe node index.js crear citas.json"
      );
      return;
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
      console.log(updatedDB);
      console.error(
        "Debes escribir cinco campos: nombre, edad, animal, color, enfermedad"
      );
      return;
    }

    await fsp.writeFile(
      path.join(__dirname, "citas.json"),
      JSON.stringify(updatedDB)
    );
    console.log("Registrado");
    rl.close();
  } catch (error) {
    console.log(error);
  }
}

async function deleteAppointmentByName() {
  try {
    const checkFile = await checkFileExists();
    if (checkFile) {
      const file = await fsp.readFile(
        path.join(__dirname, "citas.json"),
        "utf-8"
      );
      const data = JSON.parse(file);
      if (!data.some((obj: AppointmentData) => obj.nombre === firstArgument)) {
        console.log(
          `${firstArgument} no se encuentra registrado en citas.json`
        );
        rl.close();
        return;
      }

      rl.question(
        `Estás seguro que quieres eliminar la cita con el nombre ${firstArgument} (y = sí / n = no) `,
        async (answer) => {
          if (answer === "y") {
            const filteredData = data.filter(
              (obj: AppointmentData) => obj.nombre !== firstArgument
            );
            console.log(filteredData);
            await fsp.writeFile(
              path.join(__dirname, "citas.json"),
              JSON.stringify(filteredData)
            );
            console.log(
              `Cita registrada bajo el nombre ${firstArgument} ha sido eliminada`
            );
          } else if (answer === "n") {
            console.log(
              `Borrado de cita con el nombre ${firstArgument} ha sido cancelado`
            );
          } else {
            console.log("Debes elegir una opcion y o n");
          }
          rl.close();
        }
      );
    } else {
      console.log(
        "El archivo no existe, para crearlo escribe node index.js crear citas.json"
      );
      return;
    }
  } catch (error) {
    console.log("Hubo un error", error);
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
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

async function createJSONfile() {
  try {
    const fileExists = await checkFileExists();

    if (!fileExists) {
      await fsp.writeFile("citas.json", `[]`);
    } else {
      console.error("Ya existe citas.json");
      rl.close();
    }
  } catch (error) {
    console.log(error);
  }
}

async function runCommand() {
  try {
    if (command === "leer") await readAppointment();
    else if (command === "registrar") await updateAppointmentDB();
    else if (command === "crear" && firstArgument === "citas.json")
      await createJSONfile();
    else if (command === "borrar" && firstArgument !== undefined)
      await deleteAppointmentByName();
    else {
      console.error(
        `${command} no existe, intenta con leer, registrar, borrar [nombre]`
      );
      rl.close();
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
    nombre: firstArgument,
    edad: secondArgument,
    animal: thirdArgument,
    color: fourthArgument,
    enfermedad: fifthArgument,
  };

  for (const key in newData) {
    if (newData[key] === undefined) {
      return;
    }
  }

  return [...updatedData, newData];
}

export default runCommand;

