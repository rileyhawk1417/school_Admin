let reloadBtn = document.querySelector('#reloadBtn');

reloadBtn.addEventListener('click', refreshData);

/* 
* Function to reload page and refresh data
* Theres an option to load asynchronously
*/

function refreshData(){
    window.location.reload();
}

