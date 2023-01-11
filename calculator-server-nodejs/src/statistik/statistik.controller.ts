import {Request, Response} from "express";

import Helper from "../helpers/Helper";
import {LoginModel} from "../login/login.model";

export const StatistikLogin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await LoginModel.aggregate([{
            $project: {
                user_id: "$_id",
                username: "$username",
                login_date: "$created_at",
                logout_date: "$last_activity",
                unit: "minute",
                durations: {
                    $dateDiff: {
                        startDate: "$created_at",
                        endDate: "$last_activity",
                        unit: "minute"
                    }
                },
                _id: 0
            }
        }]).exec();
        const response = data.filter(dt => Number(dt.durations) > 0);
        return res.status(201).send(Helper.responseData(200, 'ok', response));
    } catch (err: any) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}



