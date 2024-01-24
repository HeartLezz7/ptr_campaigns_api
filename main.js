const { readFile, writeFile } = require("./handleFile");

// function sum(arr, category) {
//   return arr.reduce((acc, item) => {
//     if (item.category == category) {
//       acc += item.price;
//     }
//     return acc;
//   }, 0);
// }

const discount = async (amout = {}, isUsePoint = false) => {
  try {
    const products = await readFile("products.json");
    const user = await readFile("user.json");

    let discountPrice = 0;
    let totalPrice = 0;
    let discount = 0;
    let sumPrice = {};

    for (let key of products) {
      totalPrice += key.price;
      if (sumPrice[key.category] == undefined) {
        sumPrice[key.category] = key.price;
      } else {
        sumPrice[key.category] += key.price;
      }
    }

    // coupon
    if (amout.coupon != undefined) {
      if (amout.coupon.fix != undefined) {
        discount = amout.fix;
        discountPrice += totalPrice - amout.fix;
      } else if (amout.percentage != undefined) {
        discount = 1 - amout.percentage / 100;
        if (discount > 0 && discount < 1) {
          discountPrice += totalPrice * discount;
        }
      }
    }

    // on top
    if (amout.onTop != undefined && amout.category.length != 0) {
      discount = amout.onTop / 100;
      for (let i = 0; i < amout.category.length; i++) {
        let reduce = sumPrice[amout.category];
        if (reduce != undefined) {
          totalPrice -= reduce * discount;
        }
      }
    }

    if (user.point > 0 && isUsePoint) {
      discount = user.point;
      if (discount > totalPrice * 0.2) {
        discount = totalPrice * 0.2;
        discountPrice += totalPrice - discount;
      } else {
        discountPrice += totalPrice - discount;
      }
    }

    //seasonal
    if (amout.seasonal != undefined) {
      discount =
        Math.floor(totalPrice / amout.seasonal.every) * amout.seasonal.price;
      discountPrice += totalPrice - discount;
    }

    return discountPrice || totalPrice;
  } catch (error) {
    console.log(error);
  }
};

discount({ onTop: 15, category: ["cloth"] }).then((res) => console.log(res));

parameter = [
  {
    coupon: { fix: 500, percentage: 100 },
    onTop: 15,
    category: [],
    seasonal: { every: 300, price: 40 },
  },
  "isUsePoint",
];
