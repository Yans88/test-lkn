import {Request, Response} from "express";
import {LoginModel} from "./login.model";
import Helper, {UserData} from "../helpers/Helper";

export const UserLogin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {username} = req.body;        
        const user = await LoginModel.create({
            username
        }).then(function (collection) {
            const results: UserData = {
                id: collection.id,
                username: collection.username,
            }
            return results;
        });
        const token = Helper.generateToken(user);
        const response = {
            ...user,
            access_token: token,
        }
        return res.status(201).send(Helper.responseData(201, 'ok', response));
    } catch (err: any) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

export const UserLogout = async (req: Request, res: Response): Promise<Response> => {
    try {
        const last_activity = new Date();
        const id = '63bd9505373f8bdbe61e4da7';
        //const id = res.locals.userId;
        await LoginModel.findOneAndUpdate({id: id, last_activity: null}, {
            last_activity,
        }).exec();
        return res.status(200).send(Helper.responseData(200, 'logout', ""));
    } catch (err) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

export const UserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = res.locals.userId;
        const user = await LoginModel.findById(id).exec() as UserData;
        return res.status(200).send(Helper.responseData(200, 'ok', user));
    } catch (err) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}
