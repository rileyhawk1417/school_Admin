/*
    * This is for static files for example css files
    * app.use(express.static(__dirname + '/public'));
    *
    * <link rel='stylesheet' href='/style.css' />
    *
    *
*/


/*
    * Below the script shows operations for a phonebook
    * using postgresql C.R.U.D operations are done
*/

var express = require('express');
var path = require('path');
var db = require('pg');
var app = express();

app.use(express.static(path.join(__dirname,'/')));
app.set('view engine', 'ejs');

var dbConnection = "postgres://postgres:root@localhost:5432/Phonebook";


// Insert Contact

app.get('/insertContact',function(req,res){
    var dbClient = new db.Client(dbConnection);

    dbClient.connect(function(err){
        if(err)
            throw err;

        var query = "insert into Contacts (fullname,phone,mobile,address) values ($1,$2,$3,$4)";
        var fullname = req.query.fullname;
        var phone = req.query.phone;
        var mobile = req.query.mobile;
        var address = req.query.address;

        var contact = [fullname , phone , mobile , address];

        dbClient.query(query , contact , function(err){
            if(err)
                throw err;
            else {
                console.log('Contact Inserted!')    ;
                res.redirect('/');      
                res.end();
            }               
        });
    });
});


// Form Handling - Update Row / Delete Row

app.get('/handleForm',function(req,res){
    var dbClient = new db.Client(dbConnection);

    dbClient.connect(function(err){
        if(err)
            throw err;

        if(req.query.deleteBtn != null){

            var query = "delete from Contacts where id = ($1)";
            var id = [req.query.id];

            dbClient.query(query , id , function(err){
                if(err)
                    throw err;
                else {
                    console.log('Contact Deleted!') ;
                    res.redirect('/contacts.html');     
                    res.end();
                }               
            });
        } else if(req.query.updateBtn != null) {
            var query = "update Contacts set fullname=($1),phone=($2),mobile=($3),address=($4) where phone=($5)";
            var fullname = req.query.fullname;
            var phone = req.query.phone;
            var phoneHidden = req.query.phoneHidden;
            var mobile = req.query.mobile;
            var address = req.query.address;            

            dbClient.query(query , [fullname,phone,mobile,address,phoneHidden], function(err){
                if(err)
                    throw err;
                else {
                    console.log('Contact Updated!') ;
                    res.redirect('/contacts.html');     
                    res.end();
                }               
            });         
        }

    });
});


// Search contact by phone

app.get('/searchContact',function(req,res) {
    var dbClient = new db.Client(dbConnection);

    dbClient.connect(function(err){
        if(err)
            throw err;

        var query = "select * from Contacts where phone=($1)";
        var searchBoxValue = req.query.searchBoxValue;

        dbClient.query(query , [searchBoxValue], function(err,result){
            if(err)
                throw err;
            else {
                res.render('searchedContact.ejs' , {contacts: result});
                res.end();
            }               
        }); 
    });
});

// Show Contact's Table

app.get('/contacts.html',function(req,res) {
    var dbClient = new db.Client(dbConnection);

    dbClient.connect(function(err){
        if(err)
            throw err;

        var query = "select * from Contacts";

        dbClient.query(query,function(err,result){
            if(err)
                throw err;
            else {

                res.render('contacts.ejs', { contacts: result });
                res.end();
            }
        });
    });
});

app.listen(8080,function(){
    console.log('Server started');
});
