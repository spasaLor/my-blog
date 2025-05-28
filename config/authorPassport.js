const passport = require('passport');
const jwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;
const prisma = require("./prisma");

const opt={
    secretOrKey:process.env.JWT_SECRET,
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
}

const strat = new jwtStrategy(opt,async(payload,done)=>{
    const auth = await prisma.authors.findUnique({
        where:{
            id:payload.id
        }
    });
    if(!auth)
        return done(null,false);
    else
        return done(null,auth);
})

passport.use('auth-jwt',strat);

module.exports=passport