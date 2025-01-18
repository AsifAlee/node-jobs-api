const { required } = require("joi");
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please select a company"],
    },
    position: {
      type: String,
      required: [true, "Enter job postion"],
      minLength: [5, "min length is 5 chars"],
    },
    status: {
      type: String,
      enum: ["interview", "pending", "declined"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please prvoide user"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Job", jobSchema);
