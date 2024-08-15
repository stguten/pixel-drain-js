import axios from "axios";

const pixeldrain = axios.create({
    baseURL: "https://pixeldrain.com/api",
});

export default pixeldrain;