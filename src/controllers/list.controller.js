import pixeldrain from "../config/axios.config.js";
/**
 * Returns information about a file list and the files in it.
 * @param {String} id ID of the list
 * @returns {Object} The API will return some basic information about every file. 
 * Every file also has a “detail_href” field which contains a URL to the info API of the file. 
 * Follow that link to get more information about the file like size, checksum, mime type, etc. 
 * The address is relative to the API URL and should be appended to the end.
 */
async function getList(id) {
  if (id === "" || id === undefined || id === null) return new Error("Por favor verifique os parametros.");
  try {
    const list = await pixeldrain.get(`/list/${id}`);
    delete list.data.sucess;
    return list.data;
  } catch (error) {
    switch (error.response.status) {
      case 404:
        return new Error(error.response.data.message.replace("entity", "list"));
      case 500:
        return new Error(error.response.data.message);
      default:
        return new Error("Erro desconhecido.");
    }
  }
}

/**
 * Creates a list of files that can be viewed together on the file viewer page.
 * @param {String} title 
 * @param {boolean} anonymous 
 * @param {Object} files 
 * @returns {String} Return a id of list created
 */
async function postList(title, anonymous, files) {
  if (id === "" || id === undefined || id === null)
    return new Error("Por favor verifique os parametros.");
  if (!Array.isArray(files))
    return new Error("Os arquivos devem estar listados em um array.");
  try {
    const list = await pixeldrain.post(`/list`, {
      title: title,
      anonymous: anonymous || false,
      files: files,
    });
    return list.data;
  } catch (error) {
    switch (error.response.status) {
      case 413:        
      case 422:
      case 500:
        return new Error(error.response.data.message);
      default:
        return new Error("Erro desconhecido.");
    }
  }
}

export { getList, postList };
