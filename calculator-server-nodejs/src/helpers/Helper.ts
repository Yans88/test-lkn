import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface UserData {
    id: string | null,
    username: string | null,
}

const responseData = (status: number, message: string | null, data: any | null) => {
    const response = {
        status: status,
        message: message,
        data: data
    }
    return response;
}

const generateToken = (data: UserData): string => {
    return jwt.sign(data, process.env.JWT_KEY as string, {expiresIn: "7d"});
}

const getDataToken = (token: any): UserData | null => {
    const secretKey: string = process.env.JWT_KEY as string;
    let resData: any;
    jwt.verify(token, secretKey, (err: any, decode: any) => {
        if (!err) {
            resData = decode;
        } else {
            resData = "";
        }
    });
    if (resData) {
        const result: UserData = <UserData>(resData);
        return result;
    }
    return null;
}


export default {responseData, generateToken, getDataToken};