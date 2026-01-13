import { Response,Request } from "express";
import { UserModel } from "../../users/models/user.model";
import { hashPassword } from "../services/password.service";
import crypto from "crypto";

export async function forgotPassword(req:Request, res:Response) {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.json({ message: "OK" });

  const token = crypto.randomBytes(32).toString("hex");
  console.log("Reset token:",token);

  user.reset_token = token;
  user.reset_expires = new Date(Date.now() + 3600000);
  await user.save();

  res.json({ message: "Password reset sent" });
}

export async function resetPassword(req:Request, res:Response) {
  const { token, password } = req.body;

  const user = await UserModel.findOne({
    reset_token: token,
    reset_expires: { $gt: new Date() }
  });

  if (!user) throw new Error("Invalid token");

  user.password_hash = await hashPassword(password);
  user.reset_token = null;
  user.reset_expires = null;
  user.temp_password = false;

  await user.save();

  res.json({ message: "Password updated" });
}
