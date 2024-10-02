import * as fs from "fs";
import EventEmitter from "events";
import FormData from "@stguten/form-data";
import { getFilenameFromContentDisposition, onProgress } from "../utils/download.utils.js";
import { HttpStatusCodes } from "../enums/http.enum.js";
import pixeldrain from "../config/axios.config.js";

const fileEvent = new EventEmitter();

export default class File {
    constructor(token) {
        this.token = token;
    }

    async postFile(file, nameFile) {
        const formData = new FormData();
        formData.append('name', nameFile);
        formData.append('file', fs.createReadStream(file));

        try {
            const { data } = await pixeldrain.post(`/file`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Basic ${Buffer.from(this.token).toString('base64')}`
                }
            });
            return data;
        } catch (error) {
            throw new Error(HttpStatusCodes[error.response.data.value] || "UNKNOW ERROR");
        }
    }

    async putFile(file, nameFile) {
        const fileContent = fs.createReadStream(file);

        try {
            const { data } = await axios.put(`https://pixeldrain.com/api/file/${nameFile}`, fileContent, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(this.token).toString('base64')}`
                }
            });
            return data;
        } catch (error) {
            throw new Error(HttpStatusCodes[error.response.data.value]);
        }
    }


    async getFileById(folder, id, download) {
        if (!id) throw new Error("Please insert a file Id.");
        if (!fs.existsSync(folder)) throw new Error("Folder not found.");

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
                fileEvent.emit("downloadComplete", fileLocation);
            });

            file.pipe(writer);
        } catch (error) {
            throw new Error(HttpStatusCodes[error.response.data.value]);
        }
    }


    async getFileInfo(id) {
        if (!id) throw new Error("Please check the parameters.");
        try {
            const { data } = await pixeldrain.get(`/file/${id}/info`);
            return data;
        } catch (error) {
            throw new Error(HttpStatusCodes[error.response.data.value]);
        }
    }


    async getfileThumb(id, width, height) {
        if (!id) throw new Error("Please check the parameters.");
        if (width != height || (width || height < 16) || (width || height > 128)) throw new Error("The value must be between 16 and 128.");
        if (width % 16 != 0 || height != 0) throw new Error("The width and height parameters need to be a multiple of 16");

        try {
            const { data } = await pixeldrain.get(`/file/${id}/thumbnail?width=${width}&height=${height}`);
            return data;
        } catch (error) {
            throw new Error(HttpStatusCodes[error.response.data.value]);
        }
    }


    async deleteFile(id) {
        if (!id) throw new Error("Please check the parameters.");
        try {
            const { data } = await pixeldrain.delete(`/file/${id}`, {
                headers: {
                    "Authorization": `Basic ${Buffer.from(this.token).toString('base64')}`
                }
            });
            return data;
        } catch (error) {
            throw new Error(HttpStatusCodes[error.response.data.value]);
        }
    }
}