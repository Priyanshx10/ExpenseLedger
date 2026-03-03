const STORAGE_KEY = "expense_ledger_v1";

let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function addTransaction() {
  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!description || isNaN(amount)) {
    alert("Invalid input");
    return;
  }

  transactions.push({
    id: Date.now(),
    description,
    amount,
    type,
  });

  persist();
  clearForm();
  render();
}

function clearForm() {
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
}

function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  persist();
  render();
}

function calculateSummary() {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expense,
    balance: income - expense,
  };
}

function render() {
  const container = document.getElementById("transactions");
  container.innerHTML = "";

  transactions.forEach((t) => {
    const div = document.createElement("div");
    div.className = `transaction ${t.type}`;
    div.innerHTML = `
      <div>
        <strong>${t.description}</strong><br/>
        ₹ ${t.amount}
      </div>
      <button onclick="deleteTransaction(${t.id})">X</button>
    `;
    container.appendChild(div);
  });

  const summary = calculateSummary();
  document.getElementById("income").innerText = summary.income;
  document.getElementById("expense").innerText = summary.expense;
  document.getElementById("balance").innerText = summary.balance;
}

render();
