import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

const LocalStrategy = passportLocal.Strategy; 

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async(email, password, done)=>{
    try {
        const foundUser = await User.findOne({email}).exec();
        if(!foundUser) {
            return done(null, false, { message: 'Email does not exist!' });
        }
        const isPassword = await bcrypt.compare(password, foundUser.password);
        return isPassword? done(null, foundUser) : done(null, false, { message: 'Invalid password' });
    } catch (error) {
        done(error)
    }
}));


