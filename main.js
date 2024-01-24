const { readFile, writeFile } = require("./handleFile");

function sumPrice(arr, category) {
  return arr.reduce((acc, item) => {
    if (item.category == category) {
      acc += item.price;
    }
    return acc;
  }, 0);
}

const discount = async (amout, isUse = false) => {
  try {
    const products = await readFile("products.json");
    const user = await readFile("user.json");
    let discountPrice = 0;
    let discount = 0;

    const sumAccessory = sumPrice(products, "accessory");
    const sumCloth = sumPrice(products, "cloth");
    const totalPrice = sumAccessory + sumCloth;
    console.log(sumAccessory + sumCloth);

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
    if (user.point > 0 && isUse) {
      discount = user.point;
      if (discount > totalPrice * 0.2) {
        console.log("first");
        discount = totalPrice * 0.2;
        discountPrice += totalPrice - discount;
      } else {
        discountPrice += totalPrice - discount;
      }
    }

    //seasonal

    return discountPrice;
  } catch (error) {
    console.log(error);
  }
};

discount({ percentage: 10 }, true).then((res) => console.log(res));
