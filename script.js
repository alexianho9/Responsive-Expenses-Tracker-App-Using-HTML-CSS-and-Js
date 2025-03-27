// State management with a closure
const expenseTracker = (() => {
    let expenses = [];
    
    // Add expense
    const addExpense = (name, amount, quantity, date) => {
        if (!name || isNaN(amount) || amount <= 0 || isNaN(quantity) || quantity < 1 || !date) {
            throw new Error('Invalid expense name, amount, quantity, or date');
        }
        const formattedDate = new Date(date).toLocaleDateString('en-GB');
        expenses.push({
            id: Date.now(),
            name,
            amount: parseFloat(amount),
            quantity: parseInt(quantity),
            date: formattedDate
        });
    };
    
    // Edit expense
    const editExpense = (id, name, amount, quantity, date) => {
        if (!name || isNaN(amount) || amount <= 0 || isNaN(quantity) || quantity < 1 || !date) {
            throw new Error('Invalid expense name, amount, quantity, or date');
        }
        const formattedDate = new Date(date).toLocaleDateString('en-GB');
        expenses = expenses.map(exp => 
            exp.id === id ? { ...exp, name, amount: parseFloat(amount), quantity: parseInt(quantity), date: formattedDate } : exp
        );
    };
    
    // Delete expense
    const deleteExpense = (id) => {
        expenses = expenses.filter(exp => exp.id !== id);
    };
    
    // Get total balance
    const getTotal = () => {
        return expenses.reduce((sum, exp) => sum + (exp.amount * exp.quantity), 0).toFixed(2);
    };
    
    // Get expenses list
    const getExpenses = () => [...expenses];
    
    return { addExpense, editExpense, deleteExpense, getTotal, getExpenses };
})();

// DOM Elements
const form = document.getElementById('expense-form');
const nameInput = document.getElementById('expense-name');
const amountInput = document.getElementById('expense-amount');
const quantityInput = document.getElementById('expense-quantity');
const dateInput = document.getElementById('expense-date');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');
const expenseList = document.getElementById('expense-list');
const totalBalance = document.getElementById('total-balance');

let editingId = null;

// Update UI
const updateUI = () => {
    const expenses = expenseTracker.getExpenses();
    expenseList.innerHTML = expenses.map(exp => `
        <li class="expense-item" data-id="${exp.id}">
            <span>${exp.name}: ₦${exp.amount.toFixed(2)} x ${exp.quantity} (${exp.date})</span>
            <button class="edit-btn">Edit</button>
            <button>Delete</button>
        </li>
    `).join('');
    totalBalance.textContent = expenseTracker.getTotal();
};

// Reset form to "Add" mode
const resetForm = () => {
    nameInput.value = '';
    amountInput.value = '';
    quantityInput.value = '1';
    dateInput.value = '';
    addBtn.classList.remove('hidden');
    saveBtn.classList.add('hidden');
    editingId = null;
};

// Form submission for adding
form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const quantity = parseInt(quantityInput.value);
        const date = dateInput.value;

        if (editingId === null) {
            expenseTracker.addExpense(name, amount, quantity, date);
        } else {
            expenseTracker.editExpense(editingId, name, amount, quantity, date);
        }
        
        resetForm();
        updateUI();
    } catch (error) {
        alert(error.message);
    }
});

// Event delegation for edit and delete buttons
expenseList.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'BUTTON') {
        const id = parseInt(target.parentElement.dataset.id);
        if (target.classList.contains('edit-btn')) {
            const expense = expenseTracker.getExpenses().find(exp => exp.id === id);
            nameInput.value = expense.name;
            amountInput.value = expense.amount;
            quantityInput.value = expense.quantity;
            // Convert DD/MM/YYYY to YYYY-MM-DD for date input
            const [day, month, year] = expense.date.split('/');
            dateInput.value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            addBtn.classList.add('hidden');
            saveBtn.classList.remove('hidden');
            editingId = id;
        } else {
            expenseTracker.deleteExpense(id);
            resetForm();
            updateUI();
        }
    }
});

// Initial UI render
updateUI();