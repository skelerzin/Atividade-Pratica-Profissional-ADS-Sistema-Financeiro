
    const app = (function() {
        const transactionsUl = document.querySelector('#transactions');
        const incomeDisplay = document.querySelector('#money-plus');
        const expenseDisplay = document.querySelector('#money-minus');
        const balanceDisplay = document.querySelector('#balance');
        const form = document.forms.transacao;
        const { amount, text } = form;

        const toCurrency = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        // Comando de amrmazenamento das transações 

        const localStorageTransactions = JSON.parse(localStorage
            .getItem('transactions'));
        let transactions = localStorage
        .getItem('transactions') !== null ? localStorageTransactions : [];

        // Comando para remoção de transações

        const removeTransaction = ID => {
            transactions = transactions.filter(transaction => 
                transaction.id !== ID);
            updateLocalStorage();
            init();
        }

        // Declaração de classes html e css para utilizar no JS para inserção de valores nos elementos HTML

        const addTransactionIntoDOM = ({amount, name, id}) => {
            const operator = amount <0 ? '-':'+';
            const CSSClass = amount <0 ? 'minus':'plus';
            const amountWithoutOperator = Math.abs(amount);
            const li = document.createElement('li');

            li.classList.add(CSSClass);
            li.innerHTML =`
            ${name} 
            <span>${operator}R$ ${amountWithoutOperator}</span>
            <button class="delete-btn" onclick ="app.removeTransaction(${id})">x</button>`;
            transactionsUl.append(li);
        }

        // Atualização de valores relativos a entradas de dados
        const getTotal = transactionsAmounts => transactionsAmounts
            .reduce((acumulator, transaction) => acumulator + transaction, 0)
            .toFixed(2);

        const getIncome = transactionsAmounts => transactionsAmounts
            .filter(value => value > 0)
            .reduce((acumulator, value) => acumulator + value, 0)
            .toFixed(2);

        const getExpense = transactionsAmounts => toCurrency(
            Math.abs(transactionsAmounts
            .filter(value => value < 0)
            .reduce((acumulator, value) => acumulator + value, 0))
        );

        const updateBalanceValues = () => {
            const transactionsAmounts = transactions.map(({amount}) => amount);
            const total = getTotal(transactionsAmounts);
            const income = getIncome(transactionsAmounts);
            const expense = getExpense(transactionsAmounts);

            incomeDisplay.textContent = toCurrency(income);
            balanceDisplay.textContent = toCurrency(total);
            expenseDisplay.textContent = toCurrency(expense);
        }

        // Apresentação da lista de itens adicionados na pagina

        const init = () => {   
            transactionsUl.innerHTML = '' ;
            transactions.forEach(addTransactionIntoDOM);
            updateBalanceValues();
        }

        init()

        const updateLocalStorage = () => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
        }

        const generateID = () => Math.round(Math.random() * 1000);

        const clearInputs = () => {
            amount.value = '';
            text.value = '';
        }

        const addToTransactionArray = (TransactionName, TransactionAmount) => {
            transactions.push({ 
                id: generateID(), 
                name: TransactionName, 
                amount: Number(TransactionAmount) 
            });
        }

        const heandleFormSubmit = event => {
            event.preventDefault()
            
            const TransactionName = text.value.trim();
            const TransactionAmount = amount.value.trim();
            const isSomeInputEmpty = TransactionName === '' || TransactionAmount === '';

            if(isSomeInputEmpty) {
                alert('Por favor, preencha os campos em branco');
                return;
            }

            addToTransactionArray(TransactionName, TransactionAmount);
            init();
            updateLocalStorage();
            clearInputs();
        }
        
        form.addEventListener('submit', heandleFormSubmit);

        return {
            removeTransaction
        };
    })();