const { readFile } = require("../campaigns/handleFile");
const discountCampaigns = require("../campaigns/campaigns");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await readFile("products.json");
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
};

exports.summaryDiscount = async (req, res, next) => {
  try {
    const result = await discountCampaigns(req.body);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
