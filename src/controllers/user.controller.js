
import pixeldrain from "../config/axios.config.js";
import { HttpStatusCodes } from "../enums/http.enum.js";

export default class User {
  constructor(token) {
    this.token = token;
  }


  async getUserFiles() {
    try {
      const { data } = await pixeldrain.get("/user/files", {
        headers: {
          "Authorization": `Basic ${Buffer.from(this.token).toString('base64')}`
        }
      });
      return data;
    } catch (error) {
      throw new Error(HttpStatusCodes[error.response.data.value]);
    }
  }


  async getUserLists() {
    try {
      const { data } = await pixeldrain.get("/user/lists", {
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