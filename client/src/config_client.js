const config = {

  
    default:{
      
      
        // IP_ADDRESS: '127.0.0.1'
        IP_ADDRESS: '64.227.34.134'
    }
}
  
  
exports.get = function get(env){
    return config[env] || config.default
}
