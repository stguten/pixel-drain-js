'use strict';

import { getFilenameFromContentDisposition, onProgress } from "../tools/download.tools.js";
import pixeldrain from "../config/axios.config.js";
import * as fs from "fs";
import path from "path";

/**
 * Upload a file. I recommend that you use the PUT API instead of the POST API. 
 * It’s easier to use and the multipart encoding of the POST API can cause performance issues in certain environments.
 * @param {String} file Path of the file to upload
 * @param {Object} options Name of the file to upload and the boolean flag to set if the file is set or not to user
 * @returns {String} The ID of the newly uploaded file
 */
async function postFile(file, options){
    const {name, anonymous} = options || {};

    const formData = new FormData();
    formData.append('name', name || path.basename(file));
    formData.append('anonymous', anonymous || false);
    formData.append('file', fs.createReadStream(file));

    try {
        const resultado = await pixeldrain.post(`/file`,formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return resultado.data.id;
    } catch (error) {
        console.error(error);
        switch (error.response.status) {
            case 413:        
            case 422:
            case 500:
                throw new Error(error.response.data.message);
            default:
                throw new Error("Erro desconhecido.");
        }
    }
}

/**
 * Upload a file.
 * @param {String} file Path of the file to upload
 * @param {Object} options Name of the file to upload and the boolean flag to set if the file is set or not to user
 * @returns {String} The ID of the newly uploaded file
 */
async function putFile(file, options){
    const {name, anonymous} = options || {};

    const formData = new FormData();
    formData.append('name', name || path.basename(file));
    formData.append('anonymous', anonymous || false);
    formData.append('file', fs.createReadStream(file));

    try {
        const resultado = await pixeldrain.post(`/file`,formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return resultado.data.id;
    } catch (error) {
        switch (error.response.status) {
            case 413:        
            case 422:
            case 500:
              throw new Error(error.response.data.message);
            default:
              throw new Error("Erro desconhecido.");
        }
    }
}

/**
 * Returns the full file associated with the ID. Supports byte range requests.
 * Warning: If a file is using too much bandwidth it can be rate limited. 
 * The rate limit will be enabled if a file has three times more downloads than views.
 * The owner of a file can always download it. When a file is rate limited the user will
 * need to fill out a captcha in order to continue downloading the file. 
 * The captcha will only appear on the file viewer page (pixeldrain.com/u/{id}). 
 * Rate limiting has been added to prevent the spread of viruses and to stop hotlinking. 
 * Hotlinking is only allowed when files are uploaded using a Pro account.
 * 
 * Pixeldrain also includes a virus scanner. 
 * If a virus has been detected in a file the user will also have to fill in a captcha to download it.
 * @param {String} folder The folder path to save the file
 * @param {String} id ID of the file to request
 * @param {boolean} download Option to sends attachment header instead of inline
 * @returns {String} Filepath of downloaded file
 */
async function getFileById(folder, id, download){
    if (id === "" || id === undefined || id === null) return new Error("Por favor verifique os parametros.");
    if(!fs.existsSync(folder)) return new Error("Caminho/Pasta não encontrado.");
    try {
        const resultado = await pixeldrain.get(`/file/${id}${(download ? "?download" : "")}`,{
            responseType: "stream",
            onDownloadProgress: onProgress
        });

        const file = resultado.data;
        const writer = fs.createWriteStream(folder + getFilenameFromContentDisposition(resultado.headers['content-disposition']));

        file.on("end", ()=>{
            writer.end();
            console.log("\nDownload concluído!");
        });

        file.pipe(writer)
    } catch (error) {
        console.log(error);
        switch (error.response.status) {
            case 403:        
            case 404:
            case 500:
              throw new Error(error.response.data.message);
            default:
              throw new Error("Erro desconhecido.");
        }
    }
}

/**
 * Returns information about one or more files. 
 * You can also put a comma separated list of file IDs in the URL and it will return an array of file info, instead of a single object. 
 * There’s a limit of 1000 files per request.
 * @param {String|Array} id ID of the file or an array with various IDs.
 * @returns {Object} Return a Object with one or more file infos.
 */
async function getFileInfo(id){
    if (id === "" || id === undefined || id === null) return new Error("Por favor verifique os parametros.");
    try {
        const resultado = await pixeldrain.get(`/file/${id}/info`);
        return resultado.data;
    } catch (error) {
        switch (error.response.status) {
            case 413:        
            case 422:
            case 500:
              throw new Error(error.response.data.message);
            default:
              throw new Error("Erro desconhecido.");
        }
    }    
}

/**
 * Returns a PNG thumbnail image representing the file. 
 * The thumbnail image will be 128x128 px by default. 
 * You can specify the width and height with parameters in the URL. 
 * The width and height parameters need to be a multiple of 16. 
 * So the allowed values are 16, 32, 48, 64, 80, 96, 112 and 128. 
 * If a thumbnail cannot be generated for the file you will be redirected to a mime type image of 128x128 px.
 * 
 * @param {String} id ID of the file to get a thumbnail for
 * @param {Number} sizeX Width of the thumbnail image
 * @param {Number} sizeY Height of the thumbnail image
 * @returns A PNG image if a thumbnail can be generated. 
 * If a thumbnail cannot be generated you will get a 301 redirect to an image representing the type of the file.
 */
async function getfileThumb(id, sizeX, sizeY){
    if (id === "" || id === undefined || id === null) throw new Error("Por favor verifique os parametros.");
    if (sizeX != sizeY || (sizeX || sizeY < 16) || (sizeX || sizeY > 128)) throw new Error("Tamanho informado invalido");
    if (sizeX % 16 != 0 || sizeY != 0) throw new Error("O valor precisa ser multiplo de 16.");

    try {
        const resultado = await pixeldrain.get(`/file/${id}/thumbnail?width=${sizeX}&height=${sizeY}`);
        return resultado.data;
    } catch (error) {
        switch (error.response.status) {
            case 413:        
            case 422:
            case 500:
              throw new Error(error.response.data.message);
            default:
              throw new Error("Erro desconhecido.");
        }
    }
}

/**
 * Deletes a file. Only works when the users owns the file.
 * @param {String} id ID of the file to delete
 * @returns {String} A message with a status of file
 */
async function deleteFile(id){
    if (id === "" || typeof id != "string" ) return new Error("Por favor verifique os parametros.");
    try {
        const response = await pixeldrain.delete(`/file/${id}`);
        return response.data.message;
    } catch (error) {
        switch (error.response.status) {
            case 401:        
            case 403:       
            case 404:
            case 500:
              throw new Error(error.response.data.message);
            default:
              throw new Error("Erro desconhecido.");
        }
    }
}

export default {postFile, putFile, getFileById, getFileInfo, getfileThumb, deleteFile}