const { readFile } = require("./handleFile");

module.exports = async (amout) => {
  try {
    const products = await readFile("products.json");
    const user = await readFile("users.json");

    let totalPrice = 0;
    let discount = 0;
    let sumPrice = {};

    for (let key of products) {
      let result = key.price * key.amount;
      totalPrice += result;
      if (sumPrice[key.category] == undefined) {
        sumPrice[key.category] = result;
      } else {
        sumPrice[key.category] += result;
      }
    }

    let discountPrice = totalPrice;

    // coupon
    if (amout.fix != undefined) {
      discount += +amout.fix;
      discountPrice -= amout.fix;
    } else if (amout.percentage != undefined) {
      let percentDis = amout.percentage / 100;
      if (percentDis == 1) {
        return discountPrice;
      } else if (percentDis > 0 && percentDis < 1) {
        let percentPrice = Math.floor(totalPrice * percentDis);
        discount += percentPrice;
        discountPrice -= percentPrice;
      }
    }

    // on top
    if (amout.onTop != undefined && amout.categories.length != 0) {
      let onTopDis = amout.onTop / 100;
      for (let i = 0; i < amout.categories.length; i++) {
        let reduce = sumPrice[amout.categories[i]];
        if (reduce != undefined) {
          let cost = reduce * onTopDis;
          discount += cost;
          discountPrice -= cost;
        }
      }
    } else if (user.point > 0 && !!amout.isUsePoint == true) {
      let usePoint = user.point;
      if (usePoint > totalPrice * 0.2) {
        usePoint = totalPrice * 0.2;
        discountPrice -= usePoint;
      } else {
        discountPrice -= usePoint;
      }
      discount += usePoint;
    }

    //seasonal
    if ((amout.every != undefined, amout.price != undefined)) {
      let seasonDis = Math.floor(totalPrice / amout.every) * amout.price;
      discount += seasonDis;
      discountPrice -= seasonDis;
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
