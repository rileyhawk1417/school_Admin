const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('./dbConf');
const bcrypt = require('bcrypt');

function init(passport){
    console.log('Initialized');

    const authUser = (email, password, done) => {
        console.log(email, password);
        pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email],
            (err, results) => {
                if(err){
                    throw err;
                }
                console.log(results.rows);

                if(results.rows.length > 0){
                    const user = results.rows[0];

                    bcrypt.compare(password, user.password, (err, isMatch) =>{
                        if(err){
                            console.log(err);
                        }
                        if(isMatch){
                            //Success no errors
                            return done(null, user);
                        } else {
                            //Wrong password
                            return done(null, false, {message: 'Password error'});
                        }
                    });
                } else {
                    //No user or email address
                    return done(null, false, {
                        message: 'User name/Email not found',
                    });
                }
            }
        );
    };
    passport.use(
        new LocalStrategy(
            {usernameField: "email", passwordField: "password"},
            authUser
        )
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results)=>{
            if(err){
                return done(err);
            }
            console.log(`ID is $(results.rows[0].id)`);
            return done(null, results.rows[0]);
        });
    });    
}

module.exports = init;
