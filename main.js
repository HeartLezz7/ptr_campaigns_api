const { readFile, writeFile } = require("./handleFile");

function sumPrice(arr, category) {
  return arr.reduce((acc, item) => {
    if (item.category == category) {
      acc += item.price;
    }
    return acc;
  }, 0);
}

const discount = async (amout) => {
  try {
    let products = await readFile("products.json");
    let sum = 0;
    let discount = 0;

    const sumAccessory = sumPrice(products, "accessory");
    const sumCloth = sumPrice(products, "cloth");
    console.log(sumAccessory + sumCloth);

    if (amout.fix != undefined) {
      discount = amout.fix;
      sum += sumAccessory + sumCloth - amout.fix;
    }
    if (amout.percentage != undefined) {
      discount = 1 - amout.percentage / 100;
      if (discount > 0 && discount < 1) {
        sum += (sumAccessory + sumCloth) * discount;
      } else {
        sum += sumAccessory + sumCloth;
      }
    }

    return sum;
  } catch (error) {
    console.log(error);
  }
};

discount({ percentage: 10 }).then((res) => console.log(res));
