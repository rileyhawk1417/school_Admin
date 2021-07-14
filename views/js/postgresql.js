let id = document.querySelector('#ID_Entry');
let name = document.querySelector('#Name');
let surname = document.querySelector('#Surname');
let dob = document.querySelector('#Date-Of-Birth');
let amount = document.querySelector('#Amount');


/*
* creates student table and adds information
*/

function newRegistration(){
CREATE TABLE student(
    person_id BIGINT NOT NULL,
    first_name VARCHAR(255),
    surname VARCHAR(255) NOT NULL,
    dob INT NOT NULL,
    fees_owing NUMERIC NOT NULL
    PRIMARY KEY (person_id)
);
}

/*
* Selects id from student table for editing
*/
function editUser(id){
    SELECT * FROM student;
}

/*
* Function Loads values from table
*/
function loadTable(){}

/*
* Function deletes values from table
*/
