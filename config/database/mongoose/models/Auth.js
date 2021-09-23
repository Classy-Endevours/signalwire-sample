import mongoose, { model } from "mongoose";
import { genSalt, hash as _hash, compare } from "bcrypt";
const { Schema } = mongoose;
const SALT_WORK_FACTOR = 10;
const AuthSchema = new Schema(
  {
    emailId: {
      type: String,
      required: true,
      index: { unique: true },
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "owner"],
    },
    password: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ["Web", "Mobile"],
    },

    /**
     * Add more fields as desired
     */
  },
  { timestamps: true }
);

// encrypt password before storing it in database
AuthSchema.pre("save", function (next) {
  let user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();
  // generate a salt
  genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    _hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// A database method to compare password
AuthSchema.methods.comparePassword = function (candidatePassword) {
  const currentPassword = this.password;
  return new Promise((resolve, reject) => {
    compare(candidatePassword, currentPassword, function (err, isMatch) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

export default model("Auth", AuthSchema);
