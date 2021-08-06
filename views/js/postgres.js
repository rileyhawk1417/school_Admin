/*
* TODO:
* - Refactor some of the code.
* - Try to reduce the number of results coming in to about 50,
* - Try to allow user to cycle through results.
* - Allow user to download results from search or the whole list.
* - Export to CSV for admin users who want to use microsoft excel.
* - Try and optimize by making some elements share one function
*/
//Script Works as the middleware to help browser execute actions
const fields = ['id', 'fname', 'lname', 'amount_paid', 'amount_owing', 'date_joined', 'is_owing'];
const dpTable = document.querySelector('#tableBody');
const search_name = document.querySelector('#search_btn_name');
const search_amount = document.querySelector('#search_btn_amount');
const searchOptions = document.querySelector('#searchItems');
const money_search_btn = document.querySelector('#money-search');
const name_search_btn = document.querySelector('#name-search');
const nameSearchContainer = document.querySelector('#search_name');
const moneySearchContainer = document.querySelector('#search_amount');
const addStudent = document.querySelector('#add-record');
const submit = document.querySelector('#send');
const form = document.querySelector('#entryForm');
const close = document.querySelector('#close_Form');
const closeMoneySearch = document.querySelector('#close_money_search');
const closeNameSearch = document.querySelector('#close_name_search');
const cancel_btn = document.querySelectorAll('#cancel');
const print = document.querySelector('#printTable');
const innerWidth = window.innerWidth;
const innerHeight = window.innerHeight;

const vars = {
	nameSearch: document.querySelector('#searchName'),
	moneySearch: document.querySelector('#searchAmount'),
	fname: document.querySelector('#fname'),
	lname: document.querySelector('#lname'),
	amount_paid: document.querySelector('#amount_paid'),
	amount_owing: document.querySelector('#amount_owing'),
	date_joined: document.querySelector('#DOB'),
	is_owing: document.querySelector('#dropDown'),
};

window.onload = () => {
	loadTable();
	searchOptions.style.display = 'none';
};

var toggleBool = false;

function hideElements() {
	searchOptions.style.display = 'none';

	form.style.display = 'none';
}

function closeSearch(e){
	if(e.target.id === 'close_money_search'){
		hideElements();
	} else if(e.target.id === 'close_name_search'){
		hideElements();
	} else{
		console.log('Undefined');
	}
}

function showSearch(e) {
	searchOptions.style.display = 'flex';

	if (e.target.id === 'name-search') {
		searchOptions.style.display = 'flex';
		form.style.display = 'none';

		nameSearchContainer.style.visibility = 'visible';
		moneySearchContainer.style.visibility = 'hidden';
		// loadTable();
	} else if (e.target.id === 'money-search') {
		searchOptions.style.display = 'flex';
		form.style.display = 'none';

		nameSearchContainer.style.visibility = 'hidden';
		moneySearchContainer.style.visibility = 'visible';
		// loadTable();
	} else {
		console.log('Undefined');
	}
}

function showForm() {
	form.style.display = 'flex';
}

function hideForm(){
	form.style.display = 'none';
}

async function loadTable() {
	hideElements();
	try {
		while (dpTable.firstChild) dpTable.removeChild(dpTable.firstChild);
		const result = await fetch('http://localhost:5000/users/student_data', { method: 'GET' });
		const table = await result.json();
		table.forEach((res) => {
			const row = dpTable.insertRow();
			fields.forEach((c) => {
				const cell = row.insertCell();
				cell.innerText = res[c];
				cell.classList.add('trContent');
			});

			const cell_btn = row.insertCell(); // cell for button
			const trash_btn = document.createElement('button');
			const trash_Icon = document.createElement('i');
			trash_Icon.classList.add('fas', 'fa-trash', 'trash-btn');
			trash_btn.append(trash_Icon);
			cell_btn.append(trash_btn);

			//Event Listeners
			trash_btn.addEventListener('click', async (e) => {
				if (window.confirm('Delete')) {
					console.log('trash icon clicked');
					const jsonReq = {};
					jsonReq.id = res.id;
					const result = await fetch('http://localhost:5000/users/student_data', {
						method: 'DELETE',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify(jsonReq),
					});

					alert('Deleted Record');
					loadTable();
				}
			});
		});
	} catch (e) {
		console.log(`Cant load List ${e}`);
	}
}
async function addRecord(a, b, c, d, e, f) {
	
	try {
		const jsonReq = {};
		jsonReq.fname = a;
		jsonReq.lname = b;
		jsonReq.amount_paid = c;
		jsonReq.amount_owing = d;
		jsonReq.date_joined = e;
		jsonReq.is_owing = f;

		const req = await fetch('http://localhost:5000/users/student_data', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(jsonReq),
		});
		const res = await req.json();
		console.log(res);
		loadTable();
	} catch (e) {
		console.log(`Error caused by: ${e}`);
	}
}

//Search Functions

async function nameSearch(queryString) {
	try {
		while (dpTable.firstChild) dpTable.removeChild(dpTable.firstChild);
		const req = await fetch('http://localhost:5000/users/student_data', { method: 'GET' });
		const res = await req.json();

		let query = res.filter((search) => {
			if (queryString === search.fname) {
				return search.fname === queryString;
			}
			if (queryString !== search.lname) {
				return search.lname === queryString;
			}
		});
		query.forEach((res) => {
			const row = dpTable.insertRow();
			fields.forEach((c) => {
				const cell = row.insertCell();
				cell.innerText = res[c];
				cell.className = 'trContent';
			});

			const cell_btn = row.insertCell();
			const trash_btn = document.createElement('button');
			const trash_Icon = document.createElement('i');
			trash_Icon.classList.add('fas', 'fa-trash', 'trash-btn');
			trash_btn.append(trash_Icon);
			cell_btn.append(trash_btn);

			//Event Listeners
			trash_btn.addEventListener('click', async (e) => {
				if (window.confirm('Delete')) {
					console.log('trash icon clicked');
					const jsonReq = {};
					jsonReq.id = res.id;
					const result = await fetch('http://localhost:5000/users/student_data', {
						method: 'DELETE',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify(jsonReq),
					});

					alert('Deleted Record');
					loadTable();
				}
			});
		});
		console.log(query);
	} catch (e) {
		console.log(`Cause of error ${e}`);
	}
}

//< || > search for numbers only

async function moneySearch(money) {
	try {
		while (dpTable.firstChild) dpTable.removeChild(dpTable.firstChild);

		const req = await fetch('http://localhost:5000/users/student_data', { method: 'GET' });
		const res = await req.json();
		let query = res.filter((amount) => {
			if (amount.amount_owing > money) {
				return amount.amount_owing;
			} else if (amount.owing < money) {
				return amount.amount_owing;
			} else {
				return alert('failed to find result');
			}
		});
		query.forEach((res) => {
			const row = dpTable.insertRow();
			fields.forEach((c) => {
				const cell = row.insertCell();
				cell.innerText = res[c];
				cell.className = 'trContent';
			});

			const cell_btn = row.insertCell();
			const trash_btn = document.createElement('button');
			const trash_Icon = document.createElement('i');
			trash_Icon.classList.add('fas', 'fa-trash', 'trash-btn');
			trash_btn.append(trash_Icon);
			cell_btn.append(trash_btn);

			//Event Listeners
			trash_btn.addEventListener('click', async (e) => {
				if (window.confirm('Delete')) {
					console.log('trash icon clicked');
					const jsonReq = {};
					jsonReq.id = res.id;
					const result = await fetch('http://localhost:5000/users/student_data', {
						method: 'DELETE',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify(jsonReq),
					});

					alert('Deleted Record');
					loadTable();
				}
			});
		});
	} catch (e) {
		console.log(`Encountered error: ${e}`);
	}
}

//All event listeners

search_name.addEventListener('click', () => {
	nameSearch(vars.nameSearch.value);
});
search_amount.addEventListener('click', () => {
	moneySearch(vars.moneySearch.value);
});

money_search_btn.addEventListener('click', (e) => {
	showSearch(e);
});
name_search_btn.addEventListener('click', (e) => {
	showSearch(e);
});

addStudent.addEventListener('click', () => {
	showForm();
	searchOptions.style.display = 'none';
	nameSearchContainer.style.visibility = 'hidden';
	moneySearchContainer.style.visibility = 'hidden';
});

send.addEventListener('click', () => {
	addRecord(
		vars.fname.value,
		vars.lname.value,
		vars.amount_paid.value,
		vars.amount_owing.value,
		vars.date_joined.value,
		vars.is_owing.value
	);
});

close.addEventListener('click', ()=>{
	hideForm();
})

closeMoneySearch.addEventListener('click', (e)=>{
	closeSearch(e);
})

closeNameSearch.addEventListener('click', (e)=>{
	closeSearch(e);
})

print.addEventListener('click', ()=> {
	hideElements();
	window.print();

});

window.addEventListener('resize', ()=> {
	dpTable.style.width = innerWidth;
})
/*
cancel_btn.forEach(()=>{
	addEventListener('click', ()=>{
		console.log('Close Search');
	})
})
*/
/*

async function deleteR(res){
	
	if (window.confirm('Delete')) {
		console.log('trash icon clicked');
		const jsonReq = {};
		jsonReq.id = res.id;
		const result = await fetch('http://localhost:5000/users/student_data', {
			method: 'DELETE',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(jsonReq),
		});

		alert('Deleted Record');
		window.location.reload();
	}

}
*/
