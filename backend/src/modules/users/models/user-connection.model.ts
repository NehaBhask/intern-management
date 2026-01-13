import mongoose, { Schema, Types } from "mongoose";

const UserConnectionSchema = new Schema(
  {
    company_id: {
      type: Types.ObjectId,
      required: true,
      index: true
    },

    from_user_id: {
      type: Types.ObjectId,
      ref: "users",
      required: true
    },

    to_user_id: {
      type: Types.ObjectId,
      ref: "users",
      required: true
    },

    relationship_type: {
      type: String,
      enum: ["MENTORS", "SUPERVISES", "REVIEWS", "MANAGES"],
      required: true
    },

    metadata: {
      type: Schema.Types.Mixed
    },

    is_active: {
      type: Boolean,
      default: true
    },

    deactivated_at: Date
  },
  { timestamps: true }
);

/* Indexes */
UserConnectionSchema.index(
  { from_user_id: 1, to_user_id: 1, relationship_type: 1 },
  { unique: true }
);

UserConnectionSchema.index({ company_id: 1, relationship_type: 1 });

export const UserConnection = mongoose.model(
  "user_connections",
  UserConnectionSchema
);
