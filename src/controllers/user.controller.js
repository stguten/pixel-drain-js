
import pixeldrain from "../config/axios.config.js";
import { HttpStatusCodes } from "../enums/http.enum.js";

export default class User {
  constructor(token) {
    this.token = token;
  }

  
  async getUserFiles() {
    try {
      const responseSet = await pixeldrain.get("/user/files", {
        headers: {
          "Authorization": `Basic ${btoa(":" + this.token)}`
        }
      });
      return responseSet.data;
    } catch (error) {      
      throw new Error(HttpStatusCodes[error.response.data.value]);
    }
  }

  
  async getUserLists() {
    try {
      const responseSet = await pixeldrain.get("/user/lists", {
        headers: {
          "Authorization": `Basic ${btoa(":" + this.token)}`
        }
      });
      return responseSet.data;
    } catch (error) {
      throw new Error(HttpStatusCodes[error.response.data.value]);
    }
  }
}