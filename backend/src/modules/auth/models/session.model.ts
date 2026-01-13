import { Schema, model } from "mongoose";

const SessionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, required: true },
  company_id: { type: Schema.Types.ObjectId, required: true },

  refresh_token: { type: String, required: true },
  user_agent: String,
  ip_address: String,

  is_revoked: { type: Boolean, default: false },
  expires_at: { type: Date, required: true }
}, { timestamps: true });

export const SessionModel = model("sessions", SessionSchema);
