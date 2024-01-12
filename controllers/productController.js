const mongoose = require("mongoose");
const { ProductModel } = require("../models");

exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const productType = req.query.filter;
    const searchTerm = req.query.search;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    let aggregatePipeline = [{ $match: { userId } }];
    // { $sort: { date: -1 } }

    if (page) {
      aggregatePipeline.push({ $skip: (page - 1) * limit });
    }

    if (limit) {
      aggregatePipeline.push({ $limit: limit });
    }

    if (productType) {
      aggregatePipeline.push({ $match: { productType } });
    }

    if (searchTerm) {
      aggregatePipeline.push({
        $match: { name: { $regex: new RegExp(searchTerm, "i") } },
      });
    }

    const data = await ProductModel.aggregate(aggregatePipeline);
    const total = await ProductModel.countDocuments({ userId });

    res.status(200).json({
      response: "success",
      total,
      ...(!isNaN(page)
        ? { limit, currentPage: page, totalPage: Math.ceil(total / limit) }
        : {}),
      ...(productType || searchTerm ? { foundProducts: data.length } : {}),
      data,
    });
  } catch (e) {
    res.status(500).json({ response: "failed", error: e.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const data = await ProductModel.findById(req.params.id);
    if (!data) {
      return res
        .status(404)
        .json({ response: "failed", error: "product not found" });
    }
    res.status(200).json({ response: "success", data });
  } catch (e) {
    res.status(500).json({ response: "failed", error: e.message });
  }
};

exports.createProduct = async (req, res) => {
  const URL = req.protocol + "://" + req.get("host");
  const { name, description, url, productType } = req.body;
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

  if (!(name && description && url && productType && req.file)) {
    return res.status(404).json({ error: "required fields not provided" });
  } else if (!urlRegex.test(url)) {
    return res.status(400).json({ error: "invalid URL format" });
  }

  try {
    const imageData = URL + "/upload/" + req.file.filename;
    const data = new ProductModel({
      ...req.body,
      userId: new mongoose.Types.ObjectId(req.user.id),
      image: imageData,
    });
    const response = await data.save();
    res.status(201).json({
      response: "success",
      message: "Product added successfully",
      data: response,
    });
  } catch (e) {
    res.status(500).json({ response: "failed", error: e.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const url = req.protocol + "://" + req.get("host");
    let imageData;
    if (req.file) {
      imageData = url + "/upload/" + req.file.filename;
    }
    const response = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...(imageData ? { image: imageData } : {}) },
      { new: true }
    );

    if (!response) {
      return res
        .status(404)
        .json({ response: "failed", error: "product not found" });
    }

    res.status(200).json({
      response: "success",
      message: "Product Update successfully ",
      data: response,
    });
  } catch (e) {
    res.status(500).json({ response: "failed", error: e.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const response = await ProductModel.findByIdAndDelete(req.params.id);

    if (!response) {
      return res
        .status(404)
        .json({ response: "failed", error: "product not found" });
    }

    res.status(200).json({
      response: "success",
      message: "Product deleted successfully",
      data: response,
    });
  } catch (e) {
    res.status(500).json({ response: "failed", error: e.message });
  }
};
