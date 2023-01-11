import express, {Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import {UserLogin, UserLogout, UserProfile} from "./login/login.controller";
import {StatistikLogin} from "./statistik/statistik.controller";
import Authorization from "./middleware/authorization";

dotenv.config();
process.env.TZ = "Asia/Jakarta";

// connect ke database mongoDB
mongoose.set('strictQuery', false);
mongoose.connect(String(process.env.URI_DB)).then(() => {
    console.log("MongoDB connected");
}).catch(() => {
    console.log("MongoDB fail connected");
});

const app = express();
app.use(cors());
app.use(express.json())
app.get("/", function (req: Request, res: Response) {
    return res.status(200).send({message: "Test LKN Yansen"});
})

app.post('/login', UserLogin);
app.get('/logout', Authorization.Authenticated, UserLogout);
app.get('/profile', Authorization.Authenticated, UserProfile);
app.get('/statistik', StatistikLogin);

app.listen(process.env.APP_PORT, () => console.log(`${process.env.APP_NAME} running on http://127.0.0.1:${process.env.APP_PORT}`));