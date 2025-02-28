const mongoose = require("mongoose");

const ResignationSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lwd: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
});

module.exports = mongoose.model("Resignation", ResignationSchema);
