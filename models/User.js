const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ShoppingCart = require("./ShoppingCart");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, default: uuidv4 },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "user", "vendor"],
    default: "user",
  },
  avatar: { type: String },
  mobile: { type: Number },
  last_login_date: { type: Date, default: Date.now },
  address_details: {
    address_line: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String, default: "India" },
    mobile: { type: Number },
  },
  shoppingCart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShoppingCart",
  },
  orderHistory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orders",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
