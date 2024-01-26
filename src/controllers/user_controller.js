const { readFile } = require("../campaigns/handleFile");

exports.getUser = async (req, res) => {
  try {
    const user = await readFile("users.json");

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};
