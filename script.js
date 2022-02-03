function calcTotal(foodPackage) {
  let total = 0;
  for (const entry in foodPackage) {
    total += foodPackage[entry]["food-price"];
  }
  return total;
}

function convertToFloat(value) {
  return parseFloat(value.substring(3).replace(",", "."));
}

function convertFromFloat(value) {
  return value.toFixed(2).replace(".", ",");
}

function getExtraInfo() {
  return {
    name: prompt("Qual o seu nome? "),
    address: prompt("Qual o seu endereço? ")
  };
}

function generateMessage(foodPackage) {
  const total = "R$ " + convertFromFloat(calcTotal(foodPackage));
  const info = getExtraInfo();
  let message = "Olá, gostaria de fazer o pedido:\n";
  message += `- Prato: ${foodPackage["dish"]["food-title"]}\n`;
  message += `- Bebida: ${foodPackage["drink"]["food-title"]}\n`;
  message += `- Sobremesa: ${foodPackage["dessert"]["food-title"]}\n`;
  message += `Total: ${total}\n`;
  message += `\nNome: ${info["name"]}\n`;
  message += `Endereço: ${info["address"]}\n`;

  return message;
}

function replaceHTML(id, value) {
  document.querySelector(id).innerHTML = value;
}

function fillModal(selections) {
  const foodPackage = getOrder(selections);
  const entries = ["dish", "drink", "dessert"];
  const total = "R$ " + convertFromFloat(calcTotal(foodPackage));

  let item;
  for (const entry of entries) {
    item = foodPackage[entry];
    replaceHTML(`#${entry}-title`, item["food-title"]);
    replaceHTML(`#${entry}-price`, convertFromFloat(item["food-price"]));
  }
  replaceHTML("#total", total);
}

function selectEntry(doc, entry) {
  return doc.querySelector(`[data-identifier=${entry}]`);
}

function selectAllOptions(doc) {
  return doc.querySelectorAll('[data-identifier="food-option"]');
}

function extract(doc, value) {
  return doc.querySelector(`[data-identifier=${value}]`);
}

function getOrder(selections) {
  return {
    dish: {
      "food-title": extract(selections[0], "food-title").textContent,
      "food-price": convertToFloat(
        extract(selections[0], "food-price").textContent
      )
    },
    drink: {
      "food-title": extract(selections[1], "food-title").textContent,
      "food-price": convertToFloat(
        extract(selections[1], "food-price").textContent
      )
    },
    dessert: {
      "food-title": extract(selections[2], "food-title").textContent,
      "food-price": convertToFloat(
        extract(selections[2], "food-price").textContent
      )
    }
  };
}

function switchButton() {
  const buttons = document.getElementsByTagName("button");
  if (buttons[0].classList[0] === "on") {
    buttons[0].classList.remove("on");
    buttons[1].classList.remove("off");
    buttons[0].classList.add("off");
    buttons[1].classList.add("on");
  }
}

const onItemClick = (item, selections, index) => {
  return () => {
    const condition = selections[index] === null;
    if (!condition) {
      selections[index].classList.remove("selected");
    }

    item.classList.add("selected");
    selections[index] = item;

    let count = 0;
    for (const selection of selections) {
      if (selection === null) {
        count += 1;
        break;
      }
    }

    if (count === 0) {
      switchButton();
    }
  };
};

const orderSubmit = (selections) => {
  return () => {
    const values = getOrder(selections);
    const message = generateMessage(values);
    const encodedMessage = encodeURIComponent(message);
    const url =
      "https://api.whatsapp.com/send?phone=5531994566036" + encodedMessage;
    window.open(url);
  };
};

const dishes = selectEntry(document, "dishes");
const drinks = selectEntry(document, "drinks");
const desserts = selectEntry(document, "desserts");

const allDishes = selectAllOptions(dishes);
const allDrinks = selectAllOptions(drinks);
const allDesserts = selectAllOptions(desserts);

const allOptions = [allDishes, allDrinks, allDesserts];

const allSelections = [null, null, null];

const confirmButton = document.getElementById("confirm-button");
const orderButton = document.getElementById("order");
const cancelButton = document.getElementById("cancel");

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    allOptions[i][j].onclick = onItemClick(allOptions[i][j], allSelections, i);
  }
}

confirmButton.addEventListener("click", () => {
  fillModal(allSelections);
  document.querySelector("aside").style.display = "flex";
});

cancelButton.addEventListener("click", () => {
  document.querySelector("aside").style.display = "none";
});

orderButton.onclick = orderSubmit(allSelections);
