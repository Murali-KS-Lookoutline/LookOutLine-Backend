const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ShoppingCart = require("./ShoppingCart");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, default: uuidv4 },
  name: { type: String, required: true },
  lastname: { type: String },
  gender: { type: String },
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
  address_details: [
    {
      name: String,
      phone: Number,
      pincode: String,
      locality: String,
      address: String,
      city: String,
      state: String,
      landmark: String,
      type: { type: String, enum: ["Home", "Work"], default: "Home" },
    },
  ],
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
