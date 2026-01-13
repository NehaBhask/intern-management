import { Request, Response } from "express"
import * as AuthService from "../services/auth.service";
import { AuthRequest } from "../../../middlewares/auth";
import { UserModel } from "../../users/models/user.model";

export async function login(req:Request, res:Response) {
  const { email, password } = req.body;

  const meta = {
    ip: req.ip,
    ua: req.headers["user-agent"]
  };

  const data = await AuthService.login(email, password, meta);
  res.json(data);
}

export async function logout(req:Request, res:Response) {
  const { refreshToken } = req.body;
  await AuthService.logout(refreshToken);
  res.json({ message: "Logged out" });
}

export async function refresh(req:Request, res:Response) {
  const { refreshToken } = req.body;
  const data = await AuthService.refresh(refreshToken);
  res.json(data);
}
export async function me(req: AuthRequest, res: Response) {
  // user comes from JWT payload
  const { user_id } = req.user;

  const user = await UserModel.findById(user_id).select(
    "_id email name role_id company_id status temp_password"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    success: true,
    user
  });
}
