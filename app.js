document.addEventListener('DOMContentLoaded', function() {
    // Load the budget value from localStorage when the page loads
    const savedBudget = localStorage.getItem('totalBudget');
    if (savedBudget) {
        document.getElementById('total-budget').value = savedBudget;
    }
    loadTransactions();
    updateTotals();
});

document.getElementById('product-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const productName = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('price').value);
    const numberOfProduct = parseInt(document.getElementById('number-of-product').value);

    if (productName && !isNaN(price) && !isNaN(numberOfProduct)) {
        const total = price * numberOfProduct;
        const product = {
            id: Date.now(),
            name: productName,
            price: total
        };

        addTransaction(product);
        saveTransaction(product);
        updateTotals();

        // Manually reset only the necessary form fields
        document.getElementById('product-name').value = '';
        document.getElementById('price').value = '';
        document.getElementById('number-of-product').value = '';
    }
});

document.getElementById('product-list').addEventListener('click', function(event) {
    const row = event.target.closest('tr');
    const productId = parseInt(row.dataset.id);

    if (event.target.classList.contains('delete-btn')) {
        removeTransaction(productId);
        row.remove();
        updateTotals();
    } else if (event.target.classList.contains('edit-btn')) {
        const product = getTransactions().find(transaction => transaction.id === productId);
        if (product) {
            document.getElementById('product-name').value = product.name;
            document.getElementById('price').value = product.price;
            document.getElementById('number-of-product').value = product.quantity;
            removeTransaction(productId);
            row.remove();
            updateTotals();
        }
    }
});

function addTransaction(product) {
    const productRow = document.createElement('tr');
    productRow.dataset.id = product.id;

    productRow.innerHTML = `
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>
            <button class="btn btn-warning btn-sm edit-btn">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        </td>
    `;

    document.getElementById('product-list').appendChild(productRow);
}

function saveTransaction(product) {
    const transactions = getTransactions();
    transactions.push(product);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function removeTransaction(productId) {
    const transactions = getTransactions().filter(transaction => transaction.id !== productId);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || [];
}

function loadTransactions() {
    const transactions = getTransactions();
    document.getElementById('product-list').innerHTML = ''; // Clear the list before loading
    transactions.forEach(addTransaction);
}

function updateTotals() {
    const productRows = document.querySelectorAll('#product-list tr');
    let totalExpenses = 0;

    productRows.forEach(row => {
        const price = parseFloat(row.children[1].innerText);
        totalExpenses += price;
    });

    const totalBudgetInput = document.getElementById('total-budget');
    const totalBudget = parseFloat(totalBudgetInput.value) || 0;
    const remaining = totalBudget - totalExpenses;

    document.getElementById('expenses').innerText = totalExpenses.toFixed(2);
    document.getElementById('remaining').innerText = remaining.toFixed(2);
    document.getElementById('total-money').innerText = totalBudget.toFixed(2);
}

// Save the budget value to localStorage when it changes
document.getElementById('total-budget').addEventListener('input', function() {
    localStorage.setItem('totalBudget', this.value);
    updateTotals();
});
