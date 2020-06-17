const config = {

  production:{
    // password to create hashed tokens
    // store inside keroku
    SECRET: process.env.SECRET,
    DATABASE: process.env.MONGODB_URI
  },


  default:{
    SECRET: 'SUPERSECRETPASSWORD123',
    DATABASE: 'mongodb://localhost:27017/collTest'
  }
}


exports.get = function get(env){
  return config[env] || config.default
}