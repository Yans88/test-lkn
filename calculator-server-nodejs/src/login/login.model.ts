import {model, Schema} from "mongoose";

export interface ILogin {
    username: string;
    last_activity: Date

}

const loginSchema = new Schema<ILogin>(
    {
        username: {
            type: String,
            required: true,
        },
        last_activity: {
            type: Date,
            default: null
        },

    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

loginSchema.method("toJSON", function () {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

export const LoginModel = model<ILogin>(
    "LoginModel",
    loginSchema,
    "login_users"
);