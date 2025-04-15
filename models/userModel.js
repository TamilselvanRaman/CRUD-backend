const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],

    },
    phoneNumber: {
      value: {
        type: String,
        required: [true, "Please add a Phone Number"],
        unique:true,
      },
      isVerified:{
        type:Boolean,
        default: false,
      }
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
