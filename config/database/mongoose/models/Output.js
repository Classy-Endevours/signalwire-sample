const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OutputSchema = new Schema({}, { strict: false, timestamps: true });

module.exports = mongoose.model("Output", OutputSchema);
