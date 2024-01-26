const { readFile } = require("./handleFile");

module.exports = async (amout) => {
  try {
    console.log(amout, "CEHECK");
    const products = await readFile("products.json");
    const user = await readFile("users.json");

    let totalPrice = 0;
    let discount = 0;
    let sumPrice = {};

    for (let key of products) {
      let result = key.price * key.amount;
      totalPrice += result;
      if (sumPrice[key.categories] == undefined) {
        sumPrice[key.categories] = result;
      } else {
        sumPrice[key.categories] += result;
      }
    }

    // coupon
    if (amout.fix != undefined) {
      discount = amout.fix;
      discountPrice += totalPrice - amout.fix;
    } else if (amout.percentage != undefined) {
      discount = amout.percentage / 100;
      if (discount == 1) {
        return discountPrice;
      } else if (discount > 0 && discount < 1) {
        discountPrice += totalPrice * (1 - discount);
      }
    }

    // on top
    if (amout.onTop != undefined && amout.categories.length != 0) {
      discount = amout.onTop / 100;
      for (let i = 0; i < amout.categories.length; i++) {
        let reduce = sumPrice[amout.categories];
        if (reduce != undefined) {
          totalPrice -= reduce * discount;
        }
      }
    } else if (user.point > 0 && !!amout.isUsePoint == true) {
      discount = user.point;
      if (discount > totalPrice * 0.2) {
        discount = totalPrice * 0.2;
        discountPrice += totalPrice - discount;
      } else {
        discountPrice += totalPrice - discount;
      }
    }

    //seasonal
    if ((amout.every != undefined, amout.price != undefined)) {
      discount = Math.floor(totalPrice / amout.every) * amout.price;
      discountPrice += totalPrice - discount;
    }

    return { discountPrice, totalPrice, discount };
  } catch (error) {
    console.log(error);
  }
};

let parameter = [
  {
    fix: 500,
    percentage: 100,
    onTop: 15,
    categories: [],
    seasonal: { every: 300, price: 40 },
    isUsePoint: false,
  },
  "isUsePoint",
];
