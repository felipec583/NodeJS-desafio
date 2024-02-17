var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import readline from "readline";
import * as fsp from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const commands = process.argv.slice(2);
const [command, firstArgument, secondArgument, thirdArgument, fourthArgument, fifthArgument,] = commands;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rl = readline.createInterface(process.stdin, process.stdout);
function readAppointment() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkFile = yield checkFileExists();
            if (checkFile) {
                const data = yield fsp.readFile(path.join(__dirname, "citas.json"), "utf-8");
                console.log(JSON.stringify(JSON.parse(data), null, " "));
                rl.close();
            }
            else {
                console.log("El archivo no existe, para crearlo escribe node index.js crear citas.json");
                return;
            }
        }
        catch (error) {
            if (error instanceof Error)
                console.log(error.message);
        }
    });
}
function updateAppointmentDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = yield fsp.readFile(path.join(__dirname, "citas.json"), "utf-8");
            const data = JSON.parse(file);
            const updatedDB = updateObject(data);
            if (updatedDB === undefined) {
                console.log(updatedDB);
                console.error("Debes escribir cinco campos: nombre, edad, animal, color, enfermedad");
                return;
            }
            yield fsp.writeFile(path.join(__dirname, "citas.json"), JSON.stringify(updatedDB));
            console.log("Registrado");
            rl.close();
        }
        catch (error) {
            console.log(error);
        }
    });
}
function deleteAppointmentByName() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkFile = yield checkFileExists();
            if (checkFile) {
                const file = yield fsp.readFile(path.join(__dirname, "citas.json"), "utf-8");
                const data = JSON.parse(file);
                if (!data.some((obj) => obj.nombre === firstArgument)) {
                    console.log(`${firstArgument} no se encuentra registrado en citas.json`);
                    rl.close();
                    return;
                }
                rl.question(`Estás seguro que quieres eliminar la cita con el nombre ${firstArgument} (y = sí / n = no) `, (answer) => __awaiter(this, void 0, void 0, function* () {
                    if (answer === "y") {
                        const filteredData = data.filter((obj) => obj.nombre !== firstArgument);
                        console.log(filteredData);
                        yield fsp.writeFile(path.join(__dirname, "citas.json"), JSON.stringify(filteredData));
                        console.log(`Cita registrada bajo el nombre ${firstArgument} ha sido eliminada`);
                    }
                    else if (answer === "n") {
                        console.log(`Borrado de cita con el nombre ${firstArgument} ha sido cancelado`);
                    }
                    else {
                        console.log("Debes elegir una opcion y o n");
                    }
                    rl.close();
                }));
            }
            else {
                console.log("El archivo no existe, para crearlo escribe node index.js crear citas.json");
                return;
            }
        }
        catch (error) {
            console.log("Hubo un error", error);
        }
    });
}
function checkFileExists() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkFile = yield fsp
                .access("./citas.json", fsp.constants.F_OK)
                .then(() => true)
                .catch(() => false);
            if (checkFile)
                return true;
            else {
                return false;
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
function createJSONfile() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileExists = yield checkFileExists();
            if (!fileExists) {
                yield fsp.writeFile("citas.json", `[]`);
            }
            else {
                console.error("Ya existe citas.json");
                rl.close();
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function runCommand() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (command === "leer")
                yield readAppointment();
            else if (command === "registrar")
                yield updateAppointmentDB();
            else if (command === "crear" && firstArgument === "citas.json")
                yield createJSONfile();
            else if (command === "borrar" && firstArgument !== undefined)
                yield deleteAppointmentByName();
            else {
                console.error(`${command} no existe, intenta con leer, registrar, borrar [nombre]`);
                rl.close();
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function updateObject(data) {
    const updatedData = [...data];
    const newData = {
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
