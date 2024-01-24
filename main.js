const { readFile, writeFile } = require("./handleFile");

function sumPrice(arr, category) {
  return arr.reduce((acc, item) => {
    if (item.category == category) {
      acc += item.price;
    }
    return acc;
  }, 0);
}

const discount = async (amout = {}, isUsePoint = false) => {
  try {
    const products = await readFile("products.json");
    const user = await readFile("user.json");
    let discountPrice = 0;
    let discount = 0;

    const sumAccessory = sumPrice(products, "accessory");
    const sumCloth = sumPrice(products, "cloth");
    const totalPrice = sumAccessory + sumCloth;

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
    if (user.point > 0 && isUsePoint) {
      discount = user.point;
      if (discount > totalPrice * 0.2) {
        console.log("first");
        discount = totalPrice * 0.2;
        discountPrice += totalPrice - discount;
      } else {
        discountPrice += totalPrice - discount;
      }
    }

    if (amout.onTop != undefined && amout.category.length != 0) {
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

discount({ seasonal: { every: 300, price: 40 } }).then((res) =>
  console.log(res)
);

parameter = [
  {
    coupon: { fix: 500, percentage: 100 },
    onTop: 15,
    category: [],
    seasonal: { every: 300, price: 40 },
  },
  "isUsePoint",
];
