const Service = require("../models/Service");
const mongoose = require("mongoose");

// Create Service
const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Service creation failed", error: err.message });
  }
};

// Get Services
const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ services });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch services", error: err.message });
  }
};

// Get Service by ID
const getServiceById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch service", error: err.message });
  }
};

// Update Service
const updateService = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Service update failed", error: err.message });
  }
};

// Delete Service
const deleteService = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Service deletion failed", error: err.message });
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
