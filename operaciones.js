var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import * as fsp from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const commands = process.argv.slice(2);
const [command, nombre, edad, animal, color, enfermedad] = commands;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function readAppointment() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkFile = yield fsp
                .access("./citas.json", fsp.constants.F_OK)
                .then(() => true)
                .catch(() => false);
            console.log(checkFile);
            if (checkFile) {
                const data = yield fsp.readFile(path.join(__dirname, "citas.json"), "utf-8");
                console.log(data);
            }
            else {
                console.log("It does not exist");
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
                console.error("Debes escribir cinco campos: nombre, edad, animal, color, enfermedad");
                return;
            }
            fs.writeFileSync(path.join(__dirname, "citas.json"), JSON.stringify(updatedDB));
            console.log("Registrado");
        }
        catch (error) {
            console.log(error);
        }
    });
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
            default:
                console.error(`${command} no existe, intenta con leer o registrar`);
        }
    }
    catch (error) {
        console.log(error);
    }
}
function updateObject(data) {
    const updatedData = [...data];
    const newData = {
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
