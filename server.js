const express = require('express');
const { pool } = require('./dbConf');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
require('dotenv').config();
const app = express();
app.use(express.json());


const PORT = process.env.PORT || 5000;

const initPassport = require('./passportConf');

initPassport(passport);

//Parse details from form
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use(
    session({
        secret: 'secret',

        resave: false,

        saveUninitialized: false
    })
);

app.use(passport.initialize());

app.use(passport.session());
app.use(flash());
app.use(express.json());

/* Page Renderers */

app.get('/', (req, res) => {
    res.render('login.ejs');
});

app.get('/users/register', checkAuth, (req, res) => {
    res.render('register.ejs');
});

app.get('/users/login', checkAuth, (req, res) =>{
    console.log(req.session.flash.error);
    res.render('login.ejs');
});

app.get('/users/dashboard', checkNotAuthenticated, (req, res) => {
    console.log(req.isAuthenticated());
    res.render('dashboard', {user: req.user.name});
    req.flash('success_msg', 'Logged in successfully');
});

app.get('/users/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have logged out');
    res.redirect('login');
});


app.post('/users/register', async (req, res) => {
    let {name, email, password, password2} =req.body;

    let errors = [];

    console.log({
        name,
        email,
        password,
        password
    });

    if(!name || !email || !password || !password2) {
        errors.push({message: 'All fields should be filled'});
    }

    if(password.length < 6){
        errors.push({message: 'Password must be at least 8 Characters long'});
    }

    if(password !==password2){
        errors.push({message: 'Passwords do not match'});
    }

    if(errors.length > 0){
        res.render('register', {errors, name, email, password, password2});
    } else {
        hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        pool.query(
            `SELECT * FROM users
            WHERE email = $1
            `,
            [email],
            (err, results) => {
                if(err){
                    console.log(err);
                }
                console.log(results.rows);

                if(results.rows.length > 0){
                    return res.render('register', {
                        message: 'Email/User already registered'
                    });
                } else {
                    pool.query(
                        `INSERT INTO users (name, email, password)
                            VALUES ($1, $2, $3)
                            RETURNING id, password
                        `,
                        [name, email, hashedPassword],
                        (err, results) => {
                            if(err){
                                throw err;
                            }
                            console.log(results.rows);
                            req.flash('Success_msg', 'You are a registered user, please login');
                            res.redirect('/users/login');
                        }
                    );
                }
            }
        );
    }
});

/* API for HTML webpages */

app.get('/users/students', (req, res) => res.sendFile(`${__dirname}/views/students.html`));
app.get('/users/student_data', async (req, res) => {
    const rows = await loadDB();
    // console.log(rows);

    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(rows));

}); 


app.post('/users/student_data', async (req, res) =>{
    let result = {};
    try{
	// const rows = await createRecord();
	
	const reqJSON = req.body;
	await createRecord(
	    reqJSON.fname, 
	    reqJSON.lname,
	    reqJSON.amount_paid,
	    reqJSON.amount_owing,
	    reqJSON.date_joined,
	    reqJSON.is_owing);
        result.success = true;
        console.log(reqJSON);
    }
    catch(e){
	result.success = false;
    }
    finally{
	res.setHeader('content-type', 'application/json');
	res.send(JSON.stringify(result));	
    console.log(result);
    }
});

app.delete('/users/student_data', async (req, res) =>{
    let result = {};
    try{
	const reqJSON = req.body;
	await deleteRecord(reqJSON.id);
	result.success = true;
    }
    catch(e){
	result.success = false;
    }
    finally{
	res.setHeader('content-type', 'application/json');
	res.send(JSON.stringify(result));	
    }
});

/* Database Operations */

async function loadDB(){
    try{
	const results = await pool.query(`SELECT * FROM student_details ORDER BY fname OFFSET 10 ROWS FETCH FIRST 100 ROW ONLY`);
	return results.rows;
    }
    catch(e){
	console.log(`Error ${e}`);
	return [];
    }
}

async function createRecord(name, surname, amount_paid, amount_owing, dob, is_owing){
    try{
	await pool.query(`INSERT INTO student_details 
             (fname, lname, amount_paid, amount_owing, date_joined, is_owing) 
	        VALUES ($1, $2, $3, $4, $5, $6)`, 
	          [name, surname, amount_paid, amount_owing, dob, is_owing]);
	return true;
    }
    catch(e){
	console.log(`Error ${e}`);
	return false;
    }
}

async function deleteRecord(id){
    try{
	await pool.query(`DELETE FROM student_details WHERE id = $1`, [id]);
	return true;
    }
    catch(e){
	console.log(`Error ${e}`);
	return false;
    }
}



/* Authentication Checkers */

app.post(
    '/users/login',
    passport.authenticate('local', {
        successRedirect: '/users/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })
);

function checkAuth(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/users/dashboard');
    }

    next();
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
