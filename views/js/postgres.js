//Script Works as the middleware to help browser execute actions 


loadTable();

async function loadTable(){ 
  try{

  const result = await fetch('http://localhost:5000/users/student_data', {method:'GET'});
  const table = await result.json();
  table.forEach(res=>{
    //Create Table elements and then load results into the elements
      let dpTable = document.querySelector('#tableDisplay');
      let tr = document.createElement('tr');
      let studentNo = document.createElement('td');
      let name = document.createElement('td');
      let surname = document.createElement('td');
      let date_joined = document.createElement('td');
      let fees_paid = document.createElement('td');
      let fees_owing = document.createElement('td');
      let is_owing = document.createElement('td');
      let trash_btn = document.createElement('button');
      let trash_Icon = document.createElement('i');
      tr.id = 'Content';
      studentNo.id = res.id;

      studentNo.innerText = res.id;
      name.innerText = res.fname;
      surname.innerText = res.lname;
      fees_paid.innerText = res.amount_paid;
      fees_owing.innerText = res.amount_owing;
      date_joined.innerText = res.date_joined;
      is_owing.innerText = res.is_owing;
      trash_btn.innerText = 'Delete';
 
      //Add Classes for elements
      studentNo.classList.add('trContent');
      name.classList.add('trContent');
      surname.classList.add('trContent');
      fees_paid.classList.add('trContent');
      fees_owing.classList.add('trContent');
      date_joined.classList.add('trContent');
      is_owing.classList.add('trContent');
      trash_Icon.classList.add('fas');
      trash_Icon.classList.add('fa-trash');
      trash_Icon.classList.add('trash-btn');
     
      //Append table row elements to main table
      tr.append(studentNo);
      tr.append(name);
      tr.append(surname);
      tr.append(fees_paid);
      tr.append(fees_owing);
      tr.append(date_joined);
      tr.append(is_owing); 
      tr.append(trash_btn);
      
      //Event Listeners
      trash_btn.addEventListener('click', async e=> {
      console.log('trash icon clicked');	  
    const jsonReq = {};
    jsonReq.id = res.id;
    const result = await fetch('http://localhost:5000/users/student_data', {method:'DELETE', 
	headers:{'content-type': 'application/json'}, body: JSON.stringify(jsonReq)
    });

    const success = await result.json();
    alert('Deleted Record');
	  window.location.reload();
	  console.log(result);
	  console.log(success);
    

      });

      //Append the table as a child to the main element
      dpTable.appendChild(tr);
     
  }); 
  
  }
    catch(e){
    console.log(`Cant load List ${e}`);
    }

}
/*
async function DeleteRow(e){
    const jsonReq = {};
    jsonReq.id = e.target.studentNo;
    const result = await fetch('http://localhost:5000/users/student_data', {method:'DELETE', 
	headers:{'content-type': 'application/json'}, body: JSON.stringify(jsonReq)
    });

    const success = await result.json();
    alert('Deleted Record');
    console.log(success);
    
}
*/
