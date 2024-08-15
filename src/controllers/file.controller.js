import { getFilenameFromContentDisposition, onProgress } from "../utils/download.utils.js";
import { HttpStatusCodes } from "../enums/http.enum.js";
import pixeldrain from "../config/axios.config.js";
import * as fs from "fs";
import EventEmitter from "events";

const fileEvent = new EventEmitter();
export default class File {
    constructor(token) {
        this.token = token;
    }

    async postFile(file, nameFile, anonymous = false) {

        const formData = new FormData();
        formData.append('name', nameFile);
        formData.append('anonymous', anonymous);
        formData.append('file', fs.createReadStream(file));

        try {
            const resultado = await pixeldrain.post(`/file`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Basic ${btoa(":" + this.token)}`
                }
            });
            return resultado.data.id;
        } catch (error) {
            throw new Error(HttpStatusCodes[error.response.data.value] || "UNKNOW ERROR");
        }
    }

    async putFile(file, nameFile, anonymous = false) {

        const formData = new FormData();
        formData.append('name', nameFile);
        formData.append('anonymous', anonymous);
        formData.append('file', fs.createReadStream(file));

        try {
            const resultado = await pixeldrain.put(`/file`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Basic ${btoa(":" + this.token)}`
                }
            });
            return resultado.data.id;
        } catch (error) {
            throw new Error(HttpStatusCodes[error.response.data.value]);
        }
    }


    async getFileById(folder, id, download) {
        if (!!id) return new Error("Please insert a file Id.");
        if (!fs.existsSync(folder)) return new Error("Folder not found.");

        try {
            const resultado = await pixeldrain.get(`/file/${id}${(download ? "?download" : "")}`, {
                responseType: "stream",
                onDownloadProgress: onProgress
            });

            const file = resultado.data;
            const fileLocation = folder + getFilenameFromContentDisposition(resultado.headers['content-disposition']);
            const writer = fs.createWriteStream(fileLocation);

            file.on("end", () => {
                writer.end();
                console.log("\nDownload complete!");
                fileEvent.emit("downloadComplete", fileLocation);
            });

            file.pipe(writer);
        } catch (error) {
            throw new Error(HttpStatusCodes[error.response.data.value]);
        }
    }


    async getFileInfo(id) {
        if (!!id) return new Error("Por favor verifique os parametros.");
        try {
            const resultado = await pixeldrain.get(`/file/${id}/info`);
            return resultado.data;
        } catch (error) {
            throw new Error(HttpStatusCodes[error.response.data.value]);
        }
    }


    async getfileThumb(id, sizeX, sizeY) {
        if (!!id) throw new Error("Por favor verifique os parametros.");
        if (sizeX != sizeY || (sizeX || sizeY < 16) || (sizeX || sizeY > 128)) throw new Error("Tamanho informado invalido");
        if (sizeX % 16 != 0 || sizeY != 0) throw new Error("O valor precisa ser multiplo de 16.");

        try {
            const resultado = await pixeldrain.get(`/file/${id}/thumbnail?width=${sizeX}&height=${sizeY}`);
            return resultado.data;
        } catch (error) {
            throw new Error(HttpStatusCodes[error.response.data.value]);
        }
    }


    async deleteFile(id) {
        if (!!id) return new Error("Por favor verifique os parametros.");
        try {
            const response = await pixeldrain.delete(`/file/${id}`, {
                headers: {
                    "Authorization": `Basic ${btoa(":" + this.token)}`
                }
            });
            return response.data.message;
        } catch (error) {
            throw new Error(HttpStatusCodes[error.response.data.value]);
        }
    }
}