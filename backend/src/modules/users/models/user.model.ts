import mongoose, { Schema, Types, Document, Model } from "mongoose";

/* =======================
   TypeScript Interface
======================= */
export interface IUser extends Document {
  company_id: Types.ObjectId;
  role_id: Types.ObjectId;

  email: string;
  password_hash: string;
  temp_password: boolean;
  password_changed_at?: Date;

  name?: string;
  profile_photo?: string;

  profile_data?: Record<string, any>;

  github?: {
    connected: boolean;
    username?: string;
    connected_at?: Date;
  };

  status: "active" | "suspended" | "exited";
  onboarding_status: "pending" | "approved" | "rejected";

  reset_token?: string|null;
  reset_expires?: Date|null;

  last_login?: Date;
  created_by?: Types.ObjectId;
}

/* =======================
   Mongoose Schema
======================= */
const UserSchema = new Schema<IUser>(
  {
    company_id: {
      type: Types.ObjectId,
      required: true,
      index: true
    },

    role_id: {
      type: Types.ObjectId,
      required: true,
      ref: "roles"
    },

    email: {
      type: String,
      required: true,
      lowercase: true
    },

    password_hash: {
      type: String,
      required: true
    },

    temp_password: {
      type: Boolean,
      default: true
    },

    password_changed_at: Date,

    name: String,
    profile_photo: String,

    profile_data: {
      type: Schema.Types.Mixed
    },

    github: {
      connected: { type: Boolean, default: false },
      username: String,
      connected_at: Date
    },

    status: {
      type: String,
      enum: ["active", "suspended", "exited"],
      default: "active"
    },

    onboarding_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    reset_token: String,
    reset_expires: Date,

    last_login: Date,

    created_by: {
      type: Types.ObjectId,
      ref: "users"
    }
  },
  { timestamps: true }
);

/* =======================
   Indexes
======================= */
UserSchema.index({ company_id: 1, email: 1 }, { unique: true });
UserSchema.index({ company_id: 1, role_id: 1 });
UserSchema.index({ company_id: 1, status: 1 });

/* =======================
   Model Export
======================= */
export const UserModel: Model<IUser> =
  mongoose.models.users || mongoose.model<IUser>("users", UserSchema);
