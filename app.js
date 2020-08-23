//SELECTORS// -- // -- //

// VALUE SELECTORS
const balanceTotal = document.querySelector(".wallet .value");
const earningTotal = document.querySelector(".earning-total");
const expenseTotal = document.querySelector(".expense-total");

// BUTTON SELECTORS
const expenseTab = document.querySelector(".expenseTab");
const earningTab = document.querySelector(".earningTab");
const accountTab = document.querySelector(".accountTab");

//LIST ELEMENTS SELECTORS

const earningElement = document.querySelector("#earning");
const expenseElement = document.querySelector("#expense");
const accountElement = document.querySelector("#account");

//LISTS
const earningList = document.querySelector("#earning .list");
const expenseList = document.querySelector("#expense .list");
const accountList = document.querySelector("#account .list");

// earning INPUT & BUTTONS
const earningAdd = document.querySelector(".add-earning");
const earningTitle = document.getElementById("earning-title");
const earningAmount = document.getElementById("earning-amount");

// EXPENSE INPUT & BUTTONS
const expenseAdd = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title");
const expenseAmount = document.getElementById("expense-amount");

// account INPUT & BUTTONS
const accountAdd = document.querySelector(".add-account");
const accountTitle = document.getElementById("account-title");
const accountAmount = document.getElementById("account-amount");
const accountSelector = document.getElementById("account-selector");
const expenseOption = document.getElementById("expense-option");
const earningOption = document.getElementById("earning-option");

// GLOBAL VARIABLES

// ENTRY LIST ARRAY VARIABLE
let entryArray;
let wallet = 0;
let earning = 0;
let expense = 0;
const deleteItem = "delete";
const editItem = "edit";

// LOCAL STORAGE

entryArray = JSON.parse(localStorage.getItem("localEntrylist")) || [];

// UPDATE APP

updateApp();

//BUDGET APP LISTENERS

earningAdd.addEventListener("click", function () {
  if (!earningTitle.value || !earningAmount.value) return;
  let earning = {
    type: "earning",
    title: earningTitle.value,
    amount: parseInt(earningAmount.value),
  };
  entryArray.push(earning);
  updateApp();
  clearInput([earningTitle, earningAmount]);
  console.log(entryArray);
});

expenseAdd.addEventListener("click", function () {
  if (!expenseTitle.value || !expenseAmount.value) return;
  let expense = {
    type: "expense",
    title: expenseTitle.value,
    amount: parseInt(expenseAmount.value),
  };
  entryArray.push(expense);
  updateApp();
  clearInput([expenseTitle, expenseAmount]);
});

accountAdd.addEventListener("click", function () {
  if (!accountTitle.value || !accountAmount.value) return;
  if (expenseOption.checked == true) {
    let expense = {
      type: "expense",
      title: accountTitle.value,
      amount: parseInt(accountAmount.value),
    };
    entryArray.push(expense);
    updateApp();
    clearInput([accountTitle, accountAmount]);
  } else if (earningOption.checked == true) {
    let earning = {
      type: "earning",
      title: accountTitle.value,
      amount: parseInt(accountAmount.value),
    };
    entryArray.push(earning);
    updateApp();
    clearInput([accountTitle, accountAmount]);
    console.log(entryArray);
  }
});

// ON CLICK FUNCTIONS FOR EACH TAB & ELEMENT
expenseTab.addEventListener("click", function () {
  active(expenseTab);
  inactive([earningTab, accountTab]);
  show(expenseElement);
  hide([earningElement, accountElement]);
});
earningTab.addEventListener("click", function () {
  active(earningTab);
  inactive([expenseTab, accountTab]);
  show(earningElement);
  hide([expenseElement, accountElement]);
});
accountTab.addEventListener("click", function () {
  active(accountTab);
  inactive([earningTab, expenseTab]);
  show(accountElement);
  hide([expenseElement, earningElement]);
});

// DELETE & EDIT LISTENERS

earningList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
accountList.addEventListener("click", deleteOrEdit);

function deleteOrEdit(event) {
  const thisTarget = event.target;
  const entry = thisTarget.parentNode;
  if (thisTarget.id == deleteItem) {
    deleteEntry(entry);
  } else if (thisTarget.id == editItem) {
    editEntry(entry);
  }
}

// DELETE ENTRIES

function deleteEntry(entry) {
  entryArray.splice(entry.id, 1);

  updateApp();
}

// EDIT ENTRIES

function editEntry(entry) {
  let thisEntry = entryArray[entry.id];
  if (thisEntry.type == "expense" && accountTab.classList.contains("active")) {
    accountAmount.value = thisEntry.amount;
    accountTitle.value = thisEntry.title;
  } else if (
    thisEntry.type == "earning" &&
    accountTab.classList.contains("active")
  ) {
    accountAmount.value = thisEntry.amount;
    accountTitle.value = thisEntry.title;
  } else if (thisEntry.type == "earning") {
    earningAmount.value = thisEntry.amount;
    earningTitle.value = thisEntry.title;
  } else if (thisEntry.type == "expense") {
    expenseAmount.value = thisEntry.amount;
    expenseTitle.value = thisEntry.title;
  }
  deleteEntry(entry);
}

//ADD/REMOVE ACTIVE/SHOW CLASSES
function active(element) {
  element.classList.add("active");
}
function show(element) {
  element.classList.remove("hide");
}
function inactive(elementArray) {
  elementArray.forEach((element) => {
    element.classList.remove("active");
  });
}
function hide(elementArray) {
  elementArray.forEach((element) => {
    element.classList.add("hide");
  });
}

// UPDATEUI FUNCTION //

function updateApp() {
  earning = calculateTotal("earning", entryArray);
  expense = calculateTotal("expense", entryArray);
  wallet = Math.abs(calculateBalance(earning, expense));
  let sign = earning >= expense ? "$" : "-$";
  balanceTotal.innerHTML = `<small>${sign}</small>${wallet}`;
  expenseTotal.innerHTML = `<small>$</small>${expense}`;
  earningTotal.innerHTML = `<small>$</small>${earning}`;
  clearElement([earningList, expenseList, accountList]);

  entryArray.forEach((entry, index) => {
    if (entry.type == "expense") {
      showEntry(expenseList, entry.type, entry.title, entry.amount, index);
    } else if (entry.type == "earning") {
      showEntry(earningList, entry.type, entry.title, entry.amount, index);
    }
    showEntry(accountList, entry.type, entry.title, entry.amount, index);
  });
  localStorage.setItem("localEntryList", JSON.stringify(entryArray));
  this.DrawCircle(earning, expense);
}

//SHOWENTRY FUNCTION

function showEntry(list, type, title, amount, id) {
  const entry = ` <li id = "${id}" class="${type}">
                          <div class="entry"><div class="title1">Title:</div> <div class="title2">${title}</div> <div class="amount1">Amount:</div> <div class="amount2">$${amount}</div></div>
                          <button id="edit" class="edit"><i class="fa fa-edit fa-lg"></i></button>
                          <button id="delete" class="delete"><i class="fa fa-trash fa-lg"></i></button>
                      </li>`;
  const atPosition = "afterbegin";
  list.insertAdjacentHTML(atPosition, entry);
}

// CLEAR INPUTS

function clearInput(inputArray) {
  inputArray.forEach((input) => {
    input.value = "";
  });
}

// CLEAR ELEMENT FUNCTION

function clearElement(elements) {
  elements.forEach((element) => {
    element.innerHTML = "";
  });
}

function calculateTotal(type, list) {
  let sum = 0;

  list.forEach((entry) => {
    if (entry.type == type) {
      sum += entry.amount;
    }
  });

  return sum;
}

// CREATE GET BALANCE FUNCTION(earning,expense)

function calculateBalance(earning, expense) {
  return earning - expense;
}

// FUNCTION ADD ACTIVE
function active(element) {
  element.classList.add("active");
}
function show(element) {
  element.classList.remove("hide");
}
function inactive(elementArray) {
  elementArray.forEach((element) => {
    element.classList.remove("active");
  });
}
function hide(elementArray) {
  elementArray.forEach((element) => {
    element.classList.add("hide");
  });
}

//FUNCTION BAR CHART

// drawBar(earning, expense);

// // const ctx = barCanvas.getContext("2d");

// const barChart = document.querySelector(".bar-chart");
// const barCanvas = document.createElement("canvas");
// barCanvas.id = "canvas";
// barCanvas.height = 200;
// barCanvas.width = 500;

// barChart.appendChild(barCanvas);

// function drawBar(earning, expense) {
//   var earning = 100;
//   var expense = 50;
//   //   var canvas = document.getElementById("canvas");
//   if (barCanvas.getContext) {
//     var ctx = barCanvas.getContext("2d");
//     let ratio = earning / (earning + expense);
//     ctx.fillRect(0, 0, 100, 100);
//     ctx.clearRect(0, 100, 100, 100);
//     ctx.strokeRect(50, 50, 50, 50);
//   }
//   drawBar(earning, expense);
// }

// function makeBar(earning, expense) {
//   ctx.clearRect(0, 0, barCanvas.width, barCanvas.height);

// }

function DrawCircle(earning, expense) {
  let ratio = earning / (earning + expense);
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  // ctx.font = "3rem Montserrat";
  // ctx.fillStyle = "black";
  // ctx.textAlign = "center";
  // ctx.fillText("Balance", 150, 100);

  ctx.beginPath();
  ctx.rect(0, 0, ratio * 2 * 150, 200);
  ctx.fillStyle = "green";
  ctx.fill();

  ctx.beginPath();
  ctx.rect(ratio * 2 * 150, 0, (1 - ratio) * 2 * 150, 200);
  ctx.fillStyle = "red";
  ctx.fill();

  ctx.beginPath();
  // ctx.fillRect(x, y, int(width * percent), height);
  ctx.fill();
}
