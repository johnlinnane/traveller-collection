const config = {

  
    default:{
      
      
        // IP_ADDRESS: 'localhost'
        IP_ADDRESS: '64.227.34.134'
    }
}
  
  
exports.get = function get(env){
    return config[env] || config.default
}
