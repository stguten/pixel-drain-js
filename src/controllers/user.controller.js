
import pixeldrain from "../config/axios.config.js";
/**
 * Return all files from authenticated user
 * @returns {Object} Returns a JSON object with all user files.
 */
async function getUserFiles() {
  try {
    const responseSet = await pixeldrain.get("/user/files");
    return responseSet.data;    
  } catch (error) {
    switch(error.response.status){
      case 401:
      case 500:
        throw new Error(error.response.data.message);
      default:
        throw new Error("Erro desconhecido.");
    }
  }    
}

/**
 * Return all lists from authenticated user
 * @returns {Object} Returns a JSON object with all user lists.
 */
async function getUserLists() {
  try {
    const responseSet = await pixeldrain.get("/user/lists");
    return responseSet.data;
  } catch (error) {
    switch(error.response.status){
      case 401:
      case 500:
        throw new Error(error.response.data.message);
      default:        
        throw new Error("Erro desconhecido.");
    }
    
  }
}

export {getUserFiles, getUserLists}