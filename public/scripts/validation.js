function emailIsValid(email) {
   let regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
    if(regEx.test(email)) return true;
    return false;
}
function passwordIsValid(password) {      
    var regEx = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;   
    if(regEx.test(password.trim()))  return true;
    return false;
}