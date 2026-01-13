import { UserModel } from "../../users/models/user.model";
import { SessionModel } from "../models/session.model";
import { comparePassword } from "./password.service";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "./jwt.service";


export async function login(email:string, password:string, meta:{ ip?: string; ua?: string }) {
  const user = await UserModel.findOne({
    email: email.toLowerCase(),
    status: "active"
  });

  if (!user) throw new Error("Invalid credentials");

  const match = await comparePassword(password, user.password_hash);
  if (!match) throw new Error("Invalid credentials");

  const accessToken = signAccessToken({
    user_id: user._id,
    company_id: user.company_id,
    role_id: user.role_id
  });

  const refreshToken = signRefreshToken({ user_id: user._id });

  await SessionModel.create({
    user_id: user._id,
    company_id: user.company_id,
    refresh_token: refreshToken,
    user_agent: meta?.ua,
    ip_address: meta?.ip,
    expires_at: new Date(Date.now() + 7 * 86400000)
  });

  user.last_login = new Date();
  await user.save();

  return {
    accessToken,
    refreshToken,
    temp_password: user.temp_password,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role_id: user.role_id,
      company_id: user.company_id
    }
  };
}

export async function logout(refreshToken:string) {
  await SessionModel.updateOne(
    { refresh_token: refreshToken },
    { is_revoked: true }
  );
}

export async function refresh(refreshToken:string) {
  verifyRefreshToken(refreshToken);

  const session = await SessionModel.findOne({
    refresh_token: refreshToken,
    is_revoked: false,
    expires_at: { $gt: new Date() }
  });

  if (!session) throw new Error("Invalid session");

  const user = await UserModel.findById(session.user_id);
  if (!user) throw new Error("User not found");

  const accessToken = signAccessToken({
    user_id: user._id,
    company_id: user.company_id,
    role_id: user.role_id
  });

  return { accessToken };
}
