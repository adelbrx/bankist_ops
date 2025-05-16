"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Adel",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, //
  pin: 4444,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (account, sort = false) {
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  containerMovements.innerHTML = "";

  movs.forEach(function (movement, index) {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const date = new Date(account.movementsDates[index]);

    const formattedMov = new Intl.NumberFormat(account.locale, {
      style: "currency",
      currency: account.currency,
    }).format(movement.toFixed(2));
    const htmlElement = `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
                 <div class="movements__date">${`${date.getDate()}`.padStart(
                   2,
                   "0"
                 )}/${`${date.getMonth() + 1}`.padStart(
      2,
      "0"
    )}/${date.getFullYear()}</div>
                 <div class="movements__value">${formattedMov}</div>
                 </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", htmlElement);
  });
};

const calcDisplaySummary = function (account) {
  const movements = account.movements;

  const incomes = movements
    .filter((movement) => movement > 0)
    .reduce((accumulator, movement) => accumulator + movement, 0);

  const out = movements
    .filter((movement) => movement < 0)
    .reduce((accumulator, movement) => accumulator + movement, 0);

  const interest = movements
    .filter((movement) => movement > 0)
    .map((deposit) => deposit * (account.interestRate / 100))
    .filter((interest) => interest >= 1)
    .reduce((accumulator, movement) => accumulator + movement, 0);

  const formattedIncomes = new Intl.NumberFormat(account.locale, {
    style: "currency",
    currency: account.currency,
  }).format(incomes.toFixed(2));
  const formattedOut = new Intl.NumberFormat(account.locale, {
    style: "currency",
    currency: account.currency,
  }).format(out.toFixed(2));
  const formattedInterest = new Intl.NumberFormat(account.locale, {
    style: "currency",
    currency: account.currency,
  }).format(interest.toFixed(2));

  labelSumIn.textContent = `${formattedIncomes}`;
  labelSumOut.textContent = `${formattedOut}`;
  labelSumInterest.textContent = `${formattedInterest}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((item) => item[0])
      .join("");
  });
};

createUsernames(accounts);

const calcDisplayBalance = function (account) {
  const balance = account.movements.reduce(
    (acc, movement) => acc + movement,
    0
  );
  const formattedBalence = new Intl.NumberFormat(account.locale, {
    style: "currency",
    currency: account.currency,
  }).format(balance.toFixed(2));
  labelBalance.textContent = `${formattedBalence}`;
};

const startLogoutTimer = function () {
  // setting time to 5 minites
  let time = 300;

  //call timer every second
  const timer = setInterval(function () {
    const min = String(Math.trunc(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");

    //In each call print the time remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //decrese 1s
    time--;
    //when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
  }, 1000);
};

const updateUI = function (account) {
  //display movement
  displayMovements(currentAccount);
  //display balance
  calcDisplayBalance(currentAccount);
  //display summary
  calcDisplaySummary(currentAccount);
};

let currentAccount;

//Event handler
btnLogin.addEventListener("click", function (event) {
  //prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(
    (account) => account.owner === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;
    //clear inputs fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();

    const currentDate = new Date();

    labelDate.textContent = Intl.DateTimeFormat(currentAccount.locale).format(
      currentDate
    );

    startLogoutTimer();

    //update the UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (event) {
  //prevent form from submitting
  event.preventDefault();

  const movement = Math.floor(inputLoanAmount.value);

  currentAccount.movements.push(movement);

  const date = new Date();
  currentAccount.movementsDates.push(date.toISOString());
  const htmlElement = `<div class="movements__row">
                    <div class="movements__type movements__type--deposit">${
                      currentAccount.movements.length
                    } deposit</div>
                      <div class="movements__date">${`${date.getDate()}`.padStart(
                        2,
                        "0"
                      )}/${`${date.getMonth() + 1}`.padStart(
    2,
    "0"
  )}/${date.getFullYear()}</div>
                    <div class="movements__value">${movement}€</div>
                 </div>`;
  containerMovements.insertAdjacentHTML("afterbegin", htmlElement);

  //display balance
  calcDisplayBalance(currentAccount);
  //display summary
  calcDisplaySummary(currentAccount);
});

btnTransfer.addEventListener("click", function (event) {
  //prevent form from submitting
  event.preventDefault();

  accounts.forEach((account) => {
    if (inputTransferTo.value === account.username) {
      const movement = Number(inputTransferAmount.value) * -1;

      const date = new Date();

      currentAccount.movements.push(movement);
      account.movements.push(movement * -1);
      account.movementsDates.push(date.toISOString());
      const htmlElement = `<div class="movements__row">
                    <div class="movements__type movements__type--withdrawal">${
                      currentAccount.movements.length
                    } withdrawal</div>
                      <div class="movements__date">${`${date.getDate()}`.padStart(
                        2,
                        "0"
                      )}/${`${date.getMonth() + 1}`.padStart(
        2,
        "0"
      )}/${date.getFullYear()}</div>
                    <div class="movements__value">${movement}€</div>
                 </div>`;
      containerMovements.insertAdjacentHTML("afterbegin", htmlElement);

      //display balance
      calcDisplayBalance(currentAccount);
      //display summary
      calcDisplaySummary(currentAccount);
    }
  });
});

btnClose.addEventListener("click", function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );

    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (event) {
  event.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
