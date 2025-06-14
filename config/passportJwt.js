const jwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;
const prisma=require('./prisma');
const passport = require('passport');

const options={
    secretOrKey:process.env.JWT_SECRET,
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback:true
};

const strat = new jwtStrategy(options,async (req,payload,done)=>{
    const user = await prisma.users.findUnique({
        where:{
            id:payload.id
        }
    });
    if(!user)
        done(null,false);
    else{
        req.user=user;
        done(null,user);
    }
})

passport.use('user-jwt',strat);

module.exports=passport;