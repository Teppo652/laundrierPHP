<template>
   <div>      
    <section class="section">
      <div class="container has-text-centered">

          <h2 class="title">Register</h2> 
          code: {{ code }}<br>
          house: {{ house }}<br>
          user: {{ user }}<br>
          <small>How to test this webapp: <br>1. Use ADMXXX to register as house manager, write down the given registration code. <br> 2. Logout and then use the code that was given to register as regular user.</small>
          <br><br><br>
          
          <div class="columns is-centered">
            <div class="column is-5 is-3-desktop">

                <!-- error -->
                <div v-if="error" class="alert alert-danger">{{error}}</div>

                <form>
                
                  <span v-show="!codeAccepted">
                    <!-- code -->
                    <div v-show="!codeAccepted" class="control">
                    <label>Registration code</label>
                        <div class="field has-addons">
                          <div class="control wide">
                            <input class="input" type="text" 
                              placeholder="Min 6 characters"
                              v-model="regCode"
                              >                        
                          </div>
                          <div class="control">
                            <a @click.prevent="regCode != null ? validateCode() : ''" class="button is-primary">Check</a>
                          </div>
                        </div>
                    </div>
                  </span>

                  <span v-show="codeAccepted">

                    <!-- welcome text -->
                    <span v-if="isAdmin"><p>Welcome to register as house manager!</p></span>
                    <span v-else><p>Welcome to register as laundry room user!</p></span>

                    <!-- name -->
                    <div v-show="!isAdmin" class="field">
                      <div class="control">
                        <label for="name">Name</label>
                        <input id="name"
                          type="text"
                          class="input" 
                          :disabled="!codeAccepted"
                          v-model="newUser.name"
                        />
                      </div>
                    </div>
                    
                    <!-- apartment number -->
                    <div v-show="!isAdmin" class="field">
                      <div class="control">
                        <label for="aptNumber">Apartment number</label>
                        <input id="aptNumber"
                          type="text"
                          class="input" 
                          :disabled="!codeAccepted"
                          v-model="newUser.aptNumber"
                        />
                      </div>
                    </div>

                    <!-- email -->  
                    <div class="field">
                      <div class="control">
                        <label for="email">Email</label>
                        <input id="email"
                        type="email"
                        class="input" 
                        :disabled="!codeAccepted"
                        name="email"
                        v-model="newUser.email"
                      />
                      </div>
                    </div>

                    <!-- password -->  
                    <div class="field">
                      <div class="control">
                        <label for="password">Password</label>
                        <input id="password"
                          type="password"
                          class="input"                       
                          :disabled="!codeAccepted"
                          v-model="newUser.password"
                        />
                      </div>
                    </div>                    
                    
                    <!-- remember --> 
                    <div class="field">
                      <div class="control">
                        <label class="checkbox">
                        <input v-model="newUser.remember" type="checkbox">
                          Remember me
                        </label>
                      </div>
                    </div>

                    <!-- register btn -->  
                    <div class="field">
                      <div class="control">
                        <button type="submit"
                          @click.prevent="formSubmitted" 
                          :disabled="!codeAccepted"
                          class="button is-primary is-fullwidth">Continue</button>
                      </div>
                    </div>
                  </span>

                  <small>
                    <router-link class="has-text-light has-text-centered" to="/Login">Did you mean to login?</router-link>
                  </small>


              </form>
            </div>
          </div>

      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
export default {
  name: "register",
  data() {
    return {
      regCode: null,
      codeAccepted: false,
      userId: null,
      usersHouseId: null,
      isAdmin: false,
      newUser: {
        houseId: -1,
        isAdmin: 0,
        name: '',
        email: null,
        password: null,
        remember: false,     
        aptNumber: ''
      },
      tr: null,
      error: null,
      userCreated: false,
      userCreatedInAuthSystem: false,
      userSaved: false
    };
  },
  methods: {
    validateCode: function() {
      this.regCode = this.regCode.trim();
      if(this.regCode.length >= 6) { 
        // check first 3 characters - ADMxxxx --> is accepted as admin code
        if(this.regCode.substr(0,3) == "ADM") {  
           // code is admin code
    //this.getCode(this.regCode);     // -----------------------------------------------------
          this.isAdmin = 1;
          this.regCode = null;
          this.usersHouseId = null;
          this.codeAccepted = true;
        } else {
          // code is not admin code
          this.getCode(this.regCode);
          console.log('Register: this.regCode:', this.regCode);
          this.getHouseData([null, this.regCode]);
          //let arr = ['-1', '123453'];
          //this.getHouseData(arr);
        }                 
      } else {
        alert('Please check your code, mininun 6 characters');
      }
    },
    // not in use yet
    emailIsValid: function () {
      if( /(.+)@(.+){2,}\.(.+){2,}/.test(this.email.trim()) ) {
        return true; // valid email
      } else {              
        return false; // invalid email
      }
    },
    // not in use yet
    passwordIsValid: function () {
      // at least one number, one lowercase and one uppercase letter and at least six characters
      var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      return re.test(this.password.trim());
    },
    formSubmitted: function(e) {
      if(this.newUser.remember == true) { this.newUser.remember = '1'; }
      this.saveUser(this.newUser);      
    },
    ...mapActions(["saveUser", "getCode", "getHouseData"])
  }, // end methods
  watch: {
    house:function() {
      if (this.house === undefined || this.house.length == 0) {  
        console.log('no house found');
      } else {
       // house was found with code
        console.log('reg: house found');
       this.user.houseId = this.house.id;
       this.isAdmin = false;
       this.codeAccepted = true;
     
      }
    },
    user:function() {
      console.log('user watch - this.user:', this.user);
      if (this.user === undefined || this.user.length == 0) { 
        this.error = 'Please check your input data';
      } else {
        console.log('user saved - this.user:', this.user);
        if(this.isAdmin != 1) {  this.user.houseId = this.house.id; } // NEW2
        if (this.user.remember != '') {
          // save into local storage
          localStorage.setItem("remember", this.user.remember);
          console.log('saved to local storage: ', this.user.remember);
        }
        // forward to next page
        if(this.isAdmin) {
          // is admin
          this.newUser.isAdmin = this.isAdmin;        
          this.$router.replace({name: 'management'});
        } else {
          // not admin
          this.$router.push({ path: '/booking' });
        }
      }
    }
  },                  
  created() {
    this.getCode('00');
  },
  computed: mapGetters(["user", "code", "house"])
};
</script>