const User = require("../models/User");

// @desc    Delete a user
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to delete user", error: err.message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update user", error: err.message });
  }
};

// @desc    Get a user's profile
// @route   GET /api/users/:id
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch user profile", error: err.message });
  }
};

const getUserByRole = async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role })
      .select("name mobile address_details") // Select only required fields
      .lean(); // Converts Mongoose documents to plain objects for better performance

    if (users.length === 0) {
      return res.status(404).json({ message: "No Users Found" });
    }

    // Format address for each user
    const formattedUsers = users.map((user) => ({
      name: user.name,
      mobile: user.mobile || user.address_details?.mobile || null, // Use main mobile, fallback to address mobile
      address: [
        user.address_details?.address_line,
        user.address_details?.city,
        user.address_details?.state,
        user.address_details?.pincode,
        user.address_details?.country,
      ]
        .filter(Boolean) // Remove undefined/null values
        .join(", "), // Join as a single string
    }));

    res.status(200).json(formattedUsers);
  } catch (err) {
    res.status(400).json({
      message: "Failed to fetch user list",
      error: err.message,
    });
  }
};

module.exports = { deleteUser, updateUser, getUserProfile, getUserByRole };
