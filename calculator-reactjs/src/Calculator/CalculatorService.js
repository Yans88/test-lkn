import axios from "axios";

const API_URL = process.env.REACT_APP_URL_API;
const tokenLogin = process.env.REACT_APP_TOKEN_LOGIN;

class CalculatorService {
    postData(param, action) {
        const token = localStorage.getItem(tokenLogin);
        console.log(token);
        switch (action) {
            case "LOGIN":
                return axios.post(API_URL + "/login", param)
            case "LOGOUT":
                return axios.get(API_URL + "/logout", {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
            case "PROFILE":
                return axios.get(API_URL + "/profile", {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
            default:
                return axios.get(API_URL + "/profile", {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
        }
    }
}

export default new CalculatorService()