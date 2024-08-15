import List from "./src/controllers/list.controller.js";
import File from "./src/controllers/file.controller.js";
import User from "./src/controllers/user.controller.js";

class PixelDrainApi {
    #list;
    #file;
    #user;
    /**
     * Make a new instance of the PixelDrain API.
     * @param {String} Pixeldrain API token.
     */
    constructor(token) {
        this.#list = new List(token);
        this.#file = new File(token);
        this.#user = new User(token);
    }

    /**
     * Returns information about a file list and the files in it.
     * @param {String} id ID of the list
     * @returns {Object} The API will return some basic information about every file. 
     * Every file also has a “detail_href” field which contains a URL to the info API of the file. 
     * Follow that link to get more information about the file like size, checksum, mime type, etc. 
     * The address is relative to the API URL and should be appended to the end.
     */
    async getList(id) {
        return await this.#list.getList(id);
    }

    /**
     * Creates a list of files that can be viewed together on the file viewer page.
     * @param {String} title 
     * @param {boolean} anonymous 
     * @param {Object} files 
     * @returns {String} Return a id of list created
     */
    async postList(title, anonymous = false, files) {
        return await this.#list.postList(title, anonymous, files);
    }

    /**
     * Upload a file. I recommend that you use the PUT API instead of the POST API. 
     * It’s easier to use and the multipart encoding of the POST API can cause performance issues in certain environments.
     * @param {String} file Path of the file to upload
     * @param {Object} options Name of the file to upload and the boolean flag to set if the file is set or not to user
     * @returns {String} The ID of the newly uploaded file
     */
    async postFile(file, nameFile, anonymous = false) {
        return await this.#file.postFile(file, nameFile, anonymous);
    }

    /**
     * Upload a file.
     * @param {String} file Path of the file to upload
     * @param {Object} options Name of the file to upload and the boolean flag to set if the file is set or not to user
     * @returns {String} The ID of the newly uploaded file
     */
    async putFile(file, nameFile, anonymous = false) {
        return await this.#file.putFile(file, nameFile, anonymous);
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
    async getFileById(folder, id, download) {
        return await this.#file.getFileById(folder, id, download);
    }

    /**
     * Returns information about one or more files. 
     * You can also put a comma separated list of file IDs in the URL and it will return an array of file info, instead of a single object. 
     * There’s a limit of 1000 files per request.
     * @param {String|Array} id ID of the file or an array with various IDs.
     * @returns {Object} Return a Object with one or more file infos.
     */
    async getFileInfo(id) {
        return await this.#file.getFileInfo(id);
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
    async getfileThumb(id, sizeX, sizeY) {
        return await this.#file.getfileThumb(id, sizeX, sizeY);
    }

    /**
     * Deletes a file. Only works when the users owns the file.
     * @param {String} id ID of the file to delete
     * @returns {String} A message with a status of file
     */
    async deleteFile(id) {
        return await this.#file.deleteFile(id);
    }

    /**
     * Return all files from authenticated user
     * @returns {Object} Returns a JSON object with all user files.
     */
    async getUserFiles() {
        return await this.#user.getUserFiles();
    }

    /**
     * Return all lists from authenticated user
     * @returns {Object} Returns a JSON object with all user lists.
     */
    async getUserLists() {
        return await this.#user.getUserLists();
    }
}

const teste = new PixelDrainApi("24db3995-282d-4fe5-82cf-3baa953b4ce8");

console.log(teste.getUserFiles().token);
