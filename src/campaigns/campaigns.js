const { readFile } = require("./handleFile");

const discount = async (amout = {}, isUsePoint = false) => {
  try {
    const products = await readFile("products.json");
    const user = await readFile("user.json");

    let discountPrice = 0;
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

    // coupon
    if (amout.coupon != undefined && amout.coupon.fix != undefined) {
      discount = amout.coupon.fix;
      discountPrice += totalPrice - amout.coupon.fix;
    } else if (
      amout.coupon != undefined &&
      amout.coupon.percentage != undefined
    ) {
      discount = amout.coupon.percentage / 100;
      if (discount == 1) {
        return discountPrice;
      } else if (discount > 0 && discount < 1) {
        discountPrice += totalPrice * (1 - discount);
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
    } else if (user.point > 0 && isUsePoint) {
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

discount({ coupon: { percentage: 50 } }).then((res) => console.log(res));
// discount({ coupon: { fix: 300 }, onTop: 15, category: ["cloth"] }).then((res) =>
//   console.log(res)
// );

let parameter = [
  {
    coupon: { fix: 500, percentage: 100 },
    onTop: 15,
    category: [],
    seasonal: { every: 300, price: 40 },
  },
  "isUsePoint",
];
