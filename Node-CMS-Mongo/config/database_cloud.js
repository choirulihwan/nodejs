/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.exports = {    
    database: 'mongodb+srv://' + process.env.DBUSER + ':' + process.env.DBPASSWORD + '@' + process.env.DBHOST + '/' + process.env.DBNAME + '?retryWrites=true&w=majority'    
};