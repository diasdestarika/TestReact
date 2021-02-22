const dotenv = require('dotenv');
dotenv.config();

if(window.location.hostname.includes('staging-logistic')){
     //base url 
     var base_url_all = 'https://staging-api.cfu.pharmalink.id/ekspedisi-scanner/';
    
     /* JIKA SUDAH KONEK DENGAN SERVER STAGING BUKAN LOKAL */
 
     //URL LOGIN 
     var url_login = "https://staging-api.cfu.pharmalink.id/auth/login";
     var url_changeForgottenPassword = "https://staging-api.cfu.pharmalink.id/auth/forgotpassword";
     var url_verifyOTP = "https://staging-api.cfu.pharmalink.id/auth/verifyotp";
     var url_changePassword = "https://staging-api.cfu.pharmalink.id/auth/changepassword";
     var url_loginChangePassword = "https://staging-api.cfu.pharmalink.id/auth/changepassword";
}else if(window.location.hostname.includes('localhost')){
     //base url 
     var base_url_all = 'https://staging-api.cfu.pharmalink.id/ekspedisi-scanner/';
    
     /* JIKA SUDAH KONEK DENGAN SERVER STAGING BUKAN LOKAL */
 
     //URL LOGIN 
     var url_login = "https://staging-api.cfu.pharmalink.id/auth/login";
     var url_changeForgottenPassword = "https://staging-api.cfu.pharmalink.id/auth/forgotpassword";
     var url_verifyOTP = "https://staging-api.cfu.pharmalink.id/auth/verifyotp";
     var url_changePassword = "https://staging-api.cfu.pharmalink.id/auth/changepassword";
     var url_loginChangePassword = "https://staging-api.cfu.pharmalink.id/auth/changepassword";
}else if(window.location.hostname.includes('logistic')){
    // //base url 
    var base_url_all = 'https://api.cfu.pharmalink.id/ekspedisi-scanner/';
    
    // /* JIKA SUDAH KONEK DENGAN SERVER PRODUCTION BUKAN LOKAL */
    
    //URL LOGIN 
    var url_login = "https://api.cfu.pharmalink.id/auth/login";
    var url_changeForgottenPassword = "https://api.cfu.pharmalink.id/auth/forgotpassword";
    var url_verifyOTP = "https://api.cfu.pharmalink.id/auth/verifyotp";
    var url_changePassword = "https://api.cfu.pharmalink.id/auth/changepassword";
    var url_loginChangePassword = "https://api.cfu.pharmalink.id/auth/changepassword";
}


export { url_login, url_changeForgottenPassword, url_verifyOTP, url_changePassword, url_loginChangePassword, base_url_all };