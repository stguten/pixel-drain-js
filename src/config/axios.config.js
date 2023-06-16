import axios from "axios";

const pixeldrain = axios.create({
    baseURL: "https://pixeldrain.com/api",
    headers:{        
        "Authorization": "Basic " + btoa(":" + process.env.API_TOKEN_PIXELDRAIN)
    }
});

export default pixeldrain;