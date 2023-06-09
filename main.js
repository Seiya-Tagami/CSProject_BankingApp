// utils for dry
function displayNone(ele) {
  ele.classList.remove('block');
  ele.classList.add('hidden');
}

function displayBlock(ele) {
  ele.classList.remove('hidden');
  ele.classList.add('block');
}

function sideBankSwitch() {
  displayNone(config.bankPage);
  displayBlock(config.sidePage);
  config.bankPage.innerHTML = '';
  config.sidePage.innerHTML = '';
}

function bankReturn(bankAccount) {
  displayNone(config.sidePage);
  displayBlock(config.bankPage);
  config.bankPage.append(mainBankPage(bankAccount));
}

/**
 * ボタンのHTMLを作成
 * @param {string} backString
 * @param {string} nextString
 * @returns {HTMLDivElement}
 */
function backNextBtn(backString, nextString) {
  const container = document.createElement('div');
  container.classList.add('flex', 'items-center', 'gap-4');
  container.innerHTML = `
  <button
  class="js-back-btn w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
>
  ${backString}
</button>
<button
  class="js-next-btn w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
>
${nextString}
</button>
  `;

  return container;
}

// global config
const config = {
  initialForm: document.getElementById('initial-form'),
  bankPage: document.getElementById('bank-page'),
  sidePage: document.getElementById('side-page'),
};

class BankAccount {
  maxWithdrawPercent = 0.2;
  annualInterestRate = 0.08;

  constructor(firstName, lastName, email, type, accountNumber, money) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.type = type;
    this.accountNumber = accountNumber;
    this.money = money;
    this.initialDeposit = money;
  }

  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }

  calculateWithdrawAmount(amount) {
    if (amount <= this.initialDeposit * this.maxWithdrawPercent) {
      return amount;
    } else {
      return this.initialDeposit * this.maxWithdrawPercent;
    }
  }

  withdraw(amount) {
    this.money -= amount;
  }

  deposit(amount) {
    this.money += amount;
  }

  simulateTimePassage(days) {
    this.money += (this.money * days * this.annualInterestRate) / 365;
  }
}

function initializeUserAccount() {
  const form = document.getElementById('bank-form');
  let userBankAccount = new BankAccount(
    form.querySelectorAll(`input[name="userFirstName"]`).item(0).value,
    form.querySelectorAll(`input[name="userLastName"]`).item(0).value,
    form.querySelectorAll(`input[name="userEmail"]`)[0].value,
    form.querySelectorAll(`input[name="userAccountType"]:checked`).item(0).value,
    getRandomInteger(1, Math.pow(10, 8)),
    parseInt(form.querySelectorAll(`input[name="userFirstDeposit"]`).item(0).value)
  );

  config.initialForm.classList.add('hidden');
  config.bankPage.append(mainBankPage(userBankAccount));
}

function getRandomInteger(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min) + min);
  return randomNum;
}

// pages

// main page
function mainBankPage(bankAccount) {
  const nameLi = document.createElement('li');
  const bankIdLi = nameLi.cloneNode(true);
  const initialDepositLi = nameLi.cloneNode(true);

  nameLi.innerHTML = bankAccount.getFullName();
  bankIdLi.innerHTML = bankAccount.accountNumber;
  initialDepositLi.innerHTML = bankAccount.initialDeposit;

  const infoUl = document.createElement('ul');
  infoUl.classList.add('text-slate-700', 'text-xl', 'text-end');
  infoUl.append(nameLi, bankIdLi, initialDepositLi);

  const infoCon = document.createElement('div');
  infoCon.classList.add('w-full', 'flex', 'justify-end');
  infoCon.append(infoUl);

  const balanceCon = document.createElement('div');
  balanceCon.classList.add('bg-yellow-200', 'px-6', 'py-2', 'text-2xl', 'text-slate-700', 'font-bold', 'flex', 'justify-between', 'rounded-lg');

  balanceCon.innerHTML = `
  <span>Available Balance</span>
  <span>${bankAccount.money}</span>
    `;

  const menuCon = document.createElement('div');
  menuCon.classList.add('w-full', 'flex', 'items-center', 'justify-between', 'text-white', 'font-bold');
  menuCon.innerHTML = `
            <button id="js-withdrawBtn" class="bg-slate-500 p-6 rounded-lg min-w-[160px] flex items-center gap-2">
              WITHDRAWAL
              <i class="fas fa-wallet fa-2x"></i>
            </button>
            <button id="js-depositBtn" class="bg-slate-500 p-6 rounded-lg min-w-[160px] flex items-center gap-2">
              DEPOSIT
              <i class="fas fa-coins fa-2x"></i>
            </button>
            <button id="js-comeBackLaterBtn" class="bg-slate-500 p-6 rounded-lg min-w-[160px] flex items-center gap-2">
              COME BACK LATER
              <i class="fas fa-home fa-2x"></i>
            </button>

  `;

  const container = document.createElement('div');
  container.classList.add('w-[720px]', 'mx-auto', 'mt-44', 'p-4', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'sm:p-8', 'flex', 'flex-col', 'gap-6');
  container.append(infoCon, balanceCon, menuCon);

  menuCon.querySelector('#js-withdrawBtn').addEventListener('click', () => {
    sideBankSwitch();
    config.sidePage.append(withdrawPage(bankAccount));
  });

  menuCon.querySelector('#js-depositBtn').addEventListener('click', () => {
    sideBankSwitch();
    config.sidePage.append(depositPage(bankAccount));
  });

  menuCon.querySelector('#js-comeBackLaterBtn').addEventListener('click', () => {
    sideBankSwitch();
    config.sidePage.append(comeBackLaterPage(bankAccount));
  });

  return container;
}

function billInputSelector(title) {
  const container = document.createElement('div');
  container.classList.add('space-y-4');
  container.innerHTML = `
    <h5 class="text-4xl font-medium text-gray-900 text-center">${title}</h5>
    <div class="flex items-center justify-between gap-4">
      <label>$100</label>
      <input
        type="number"
        name="number"
        id="number"
        data-bill="100"
        class="js-bill-input bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[360px] w-full p-2.5 text-end"
        value="0"
      />
    </div>
    <div class="flex items-center justify-between gap-4">
      <label>$50</label>
      <input
        type="number"
        name="number"
        id="number"
        data-bill="50"
        class="js-bill-input bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[360px] w-full p-2.5 text-end"
        value="0"
      />
    </div>
    <div class="flex items-center justify-between gap-4">
      <label>$20</label>
      <input
        type="number"
        name="number"
        id="number"
        data-bill="20"
        class="js-bill-input bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[360px] w-full p-2.5 text-end"
        value="0"
      />
    </div>
    <div class="flex items-center justify-between gap-4">
      <label>$10</label>
      <input
        type="number"
        name="number"
        id="number"
        data-bill="10"
        class="js-bill-input bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[360px] w-full p-2.5 text-end"
        value="0"
      />
    </div>
    <div class="flex items-center justify-between gap-4">
      <label>$5</label>
      <input
        type="number"
        name="number"
        id="number"
        data-bill="5"
        class="js-bill-input bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[360px] w-full p-2.5 text-end"
        value="0"
      />
    </div>
    <div class="flex items-center justify-between gap-4">
      <label>$1</label>
      <input
        type="number"
        name="number"
        id="number"
        data-bill="1"
        class="js-bill-input bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[360px] w-full p-2.5 text-end"
        value="0"
      />
    </div>
    <div class="w-full p-2 text-center bg-yellow-200 font-bold text-xl">
      <span class="js-withdrawTotal">$0</span>
    </div>

  `;
  container.append(backNextBtn('back', 'next'));
  return container;
}

// withdraw page
function withdrawPage(bankAccount) {
  const container = document.createElement('div');
  container.classList.add('w-full', 'max-w-lg', 'p-4', 'mx-auto', 'mt-20', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'sm:p-6', 'md:p-8');

  const comeBackLaterContainer = document.createElement('form');
  comeBackLaterContainer.append(billInputSelector('Please Enter The Withdrawal Amount'));

  container.append(comeBackLaterContainer);

  let billTotal = '$0';
  const billInputs = comeBackLaterContainer.querySelectorAll('.js-bill-input');
  billInputs.forEach((billInput) => {
    billInput.addEventListener('change', (e) => {
      billTotal = billSummation(billInputs);
      document.querySelector('.js-withdrawTotal').innerHTML = billTotal;
    });
  });

  const backBtn = comeBackLaterContainer.querySelector('.js-back-btn');
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    bankReturn(bankAccount);
  });

  const nextBtn = comeBackLaterContainer.querySelector('.js-next-btn');
  nextBtn.addEventListener('click', () => {
    container.innerHTML = '';
    container.append(billDialog('The money you are going to take is ...', billInputs, billTotal));

    let calculatedAmount = bankAccount.calculateWithdrawAmount(parseInt(billTotal.replace('$', '')));
    container.innerHTML += `
    <p class="p-4 text-xl">Total to be withdrawn: $${calculatedAmount}</p>
    `;

    container.append(backNextBtn('back', 'confirm'));

    // when putting confirm btn
    const nextBtn = container.querySelector('.js-next-btn');
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      bankAccount.withdraw(calculatedAmount);
      bankReturn(bankAccount);
    });

    const backBtn = container.querySelector('.js-back-btn');
    backBtn.addEventListener('click', () => {
      config.sidePage.innerHTML = '';
      config.sidePage.append(withdrawPage(bankAccount));
    });
  });

  return container;
}

/**
 * billInputsの計算
 * @param {NodeList} billInputs
 * @returns {string}
 */
function billSummation(billInputs) {
  const dollars = Array.from(billInputs).map((billInput) => billInput.dataset.bill);
  let total = 0;

  for (let i = 0; i < dollars.length; i++) {
    total += billInputs[i].value * dollars[i];
  }

  return `$${total}`;
}

/**
 * billDialogの描画
 * @param {string} title
 * @param {NodeList} inputElementNodeList
 * @param {string} billTotal
 * @returns {HTMLDivElement}
 */
function billDialog(title, inputElementNodeList, billTotal) {
  const container = document.createElement('div');
  const dollars = Array.from(inputElementNodeList).map((billInput) => billInput.dataset.bill);
  let billElements = '';

  for (let i = 0; i < inputElementNodeList.length; i++) {
    if (0 < parseInt(inputElementNodeList[i].value)) {
      billElements += `
      <tr class="bg-white dark:bg-gray-800">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${inputElementNodeList[i].value}</th>
                    <td class="px-6 py-4">$${dollars[i]}</td>
                  </tr>
      `;
    }
  }

  const totalString = `
  <tr class="bg-white dark:bg-gray-800">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Total</th>
                    <td class="px-6 py-4">${billTotal}</td>
                  </tr>
  `;

  container.innerHTML = `
  <div class="space-y-6" action="#">
  <h5 class="text-4xl font-medium text-gray-900 text-center">${title}</h5>
            <div class="relative overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">Amount</th>
                    <th scope="col" class="px-6 py-3">Price</th>
                  </tr>
                </thead>
                <tbody>
                 ${billElements}
                  ${totalString}
                </tbody>
              </table>
            </div>
          </div>
  `;

  return container;
}

// deposit page
function depositPage(bankAccount) {
  const container = document.createElement('div');
  container.classList.add('w-full', 'max-w-lg', 'p-4', 'mx-auto', 'mt-20', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'sm:p-6', 'md:p-8');

  const comeBackLaterContainer = document.createElement('form');
  comeBackLaterContainer.append(depositInputSelector('Please Enter The Deposit Amount'));

  container.append(comeBackLaterContainer);

  let billTotal = '$0';
  const billInputs = comeBackLaterContainer.querySelectorAll('.js-bill-input');
  billInputs.forEach((billInput) => {
    billInput.addEventListener('change', (e) => {
      billTotal = billSummation(billInputs);
      document.querySelector('.js-withdrawTotal').innerHTML = billTotal;
    });
  });

  const backBtn = comeBackLaterContainer.querySelector('.js-back-btn');
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    bankReturn(bankAccount);
  });

  const nextBtn = comeBackLaterContainer.querySelector('.js-next-btn');
  nextBtn.addEventListener('click', () => {
    container.innerHTML = '';
    container.append(billDialog('The money you are going to deposit is ...', billInputs, billTotal));

    let calculatedAmount = parseInt(billTotal.replace('$', ''));
    container.innerHTML += `
    <p class="p-4 text-xl">Total to be withdrawn: $${calculatedAmount}</p>
    `;

    container.append(backNextBtn('back', 'confirm'));

    // when putting confirm btn
    const nextBtn = container.querySelector('.js-next-btn');
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      bankAccount.deposit(calculatedAmount);
      bankReturn(bankAccount);
    });

    const backBtn = container.querySelector('.js-back-btn');
    backBtn.addEventListener('click', () => {
      config.sidePage.innerHTML = '';
      config.sidePage.append(depositPage(bankAccount));
    });
  });

  return container;
}

function depositInputSelector(title) {
  const container = document.createElement('div');
  container.classList.add('space-y-4');
  container.innerHTML = `
    <h5 class="text-4xl font-medium text-gray-900 text-center">${title}</h5>
    <div class="flex items-center justify-between gap-4">
      <label>$100</label>
      <input
        type="number"
        name="number"
        id="number"
        data-bill="100"
        class="js-bill-input bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[360px] w-full p-2.5 text-end"
        value="0"
      />
    </div>
    <div class="flex items-center justify-between gap-4">
      <label>$50</label>
      <input
        type="number"
        name="number"
        id="number"
        data-bill="50"
        class="js-bill-input bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[360px] w-full p-2.5 text-end"
        value="0"
      />
    </div>
    <div class="flex items-center justify-between gap-4">
      <label>$20</label>
      <input
        type="number"
        name="number"
        id="number"
        data-bill="20"
        class="js-bill-input bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[360px] w-full p-2.5 text-end"
        value="0"
      />
    </div>
    <div class="flex items-center justify-between gap-4">
      <label>$10</label>
      <input
        type="number"
        name="number"
        id="number"
        data-bill="10"
        class="js-bill-input bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[360px] w-full p-2.5 text-end"
        value="0"
      />
    </div>
    <div class="flex items-center justify-between gap-4">
      <label>$5</label>
      <input
        type="number"
        name="number"
        id="number"
        data-bill="5"
        class="js-bill-input bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[360px] w-full p-2.5 text-end"
        value="0"
      />
    </div>
    <div class="flex items-center justify-between gap-4">
      <label>$1</label>
      <input
        type="number"
        name="number"
        id="number"
        data-bill="1"
        class="js-bill-input bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[360px] w-full p-2.5 text-end"
        value="0"
      />
    </div>
    <div class="w-full p-2 text-center bg-yellow-200 font-bold text-xl">
      <span class="js-withdrawTotal">$0</span>
    </div>

  `;
  container.append(backNextBtn('back', 'next'));
  return container;
}

// comebacklater page
function comeBackLaterPage(bankAccount) {
  const container = document.createElement('div');
  container.classList.add('w-full', 'max-w-lg', 'p-4', 'mx-auto', 'mt-20', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'sm:p-6', 'md:p-8');

  const comeBackLaterContainer = document.createElement('form');
  comeBackLaterContainer.append(comeBackLaterInputSelector('How many days will you be gone?'));

  container.append(comeBackLaterContainer);

  const backBtn = container.querySelector('.js-back-btn');
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    bankReturn(bankAccount);
  });

  const daysInput = container.querySelector('.js-days');
  const nextBtn = container.querySelector('.js-next-btn');
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let totalDaysGone = parseInt(daysInput.value);
    bankAccount.simulateTimePassage(totalDaysGone);
    bankReturn(bankAccount);
  });

  return container;
}

function comeBackLaterInputSelector(title) {
  const container = document.createElement('div');
  container.classList.add('space-y-4');
  container.innerHTML = `
  <h5 class="text-4xl font-medium text-gray-900 text-center">${title}</h5>
<div>
  <input
    type="number"
    class="js-days bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    value="0"
  />
</div>
  `;
  container.append(backNextBtn('back', 'confirm'));
  return container;
}
