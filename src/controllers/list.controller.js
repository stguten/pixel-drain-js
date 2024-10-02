import pixeldrain from "../config/axios.config.js";
import { HttpStatusCodes } from "../enums/http.enum.js";

export default class List {
  constructor(token) {
    this.token = token;
  }


  async getList(id) {
    if (!id) return new Error("Por favor verifique os parametros.");
    try {
      const { data } = await pixeldrain.get(`/list/${id}`);
      delete data.sucess;
      return data;
    } catch (error) {
      throw new Error(HttpStatusCodes[error.response.data.value]);
    }
  }


  async postList(title, files) {
    if (!id) throw new Error("Por favor verifique os parametros.");
    if (!Array.isArray(files)) throw new Error("Os arquivos devem estar listados em um array.");
    try {
      const { data } = await pixeldrain.post(`/list`, {
        title: title,
        anonymous: anonymous,
        files: files,
      });
      return data;
    } catch (error) {
      throw new Error(HttpStatusCodes[error.response.data.value]);
    }
  }

}
