const mongoose = require("mongoose");

const ExitResponseSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  responses: [
    {
      questionText: { type: String, required: true },
      response: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("ExitResponse", ExitResponseSchema);
