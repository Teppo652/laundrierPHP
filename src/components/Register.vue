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
                                  
              <!-- error message -->
              <div v-show="errorMsg != ''" class="notification is-danger">                
                <strong>{{ errorMsg }}</strong>
              </div>
                
                  <span v-show="!codeAccepted">
                    <!-- code -->
                    <div v-show="!codeAccepted" class="control">
                    <label>Registration code</label>
                        <div class="field has-addons">
                          <div class="control wide">
                            <input class="input" type="text" 
                              placeholder="Min 6 characters"
                              v-model="regCode"
                              :tabindex="0"
                              >                        
                          </div>
                          <div class="control">
                            <a @click.prevent="regCode != null ? validateCode() : ''" 
                               :tabindex="1"
                               class="button is-primary">Check</a>
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
                      <p class="control has-addons">
                        <label for="password">Password</label>
                        <input id="password"
                          type="password"
                          class="input"
                           placeholder="Password"
                          :disabled="!codeAccepted"
                          v-model="newUser.password"
                        />
                      </p>
                      <button @click.prevent="passwordHelper ? passwordHelper = false : passwordHelper = true"
                          class="button moreInfo">
                        <span class="icon is-primary">
                          <i class="fas fa-info-circle"></i>
                        </span>
                      </button>
                    </div>
                    <div v-if="passwordHelper" class="notification is-link">
                      <button class="delete" @click.prevent="passwordHelper = false"></button> 
                      <ul>Password must include at least:
                        <li>One number</li>
                        <li>One lowercase letter</li>
                        <li>One uppercase letter</li>
                        <li>Be six characters long</li>
                      </ul>
                    </div>

                    <!-- passwordAgain 
                    <div class="field">
                      <p class="control has-addons">
                        <label for="passwordAgain">Password again</label>
                        <input id="passwordAgain"
                          type="password"
                          class="input"
                           placeholder="Password again"
                          v-model="passwordAgain"
                        />
                      </p>
                    </div>  -->
                    
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
        name: 'Tester', /* CHANGE TO '' */
        email: 'test9087654@sdfghjk.com', /* CHANGE TO null */
        password: 'qwer1234', /* CHANGE TO null */
        remember: false,     
        aptNumber: '987', /* CHANGE TO '' */
      },
      tr: null,
      passwordHelper: false,
      passwordAgain: '',
      userCreated: false,
      userCreatedInAuthSystem: false,
      userSaved: false,
      errorMsg: ''
    };
  },
  methods: {
    validateCode: function() {
      this.regCode = this.regCode.trim();
      if(this.regCode.length >= 6 && this.regCode.length <= 8) { 
        // check first 3 characters - ADMxxxx --> is accepted as admin code
        if(this.regCode.substr(0,3) == "ADM") {  
           // code is admin code
          this.isAdmin = true; // 1
          this.regCode = null;
          this.usersHouseId = null;
          this.codeAccepted = true;
        } else {
          // code is not admin code
          this.getCode(this.regCode);
          console.log('Register: this.regCode:', this.regCode);
          this.getHouseData([null, this.regCode]);
        }                 
      } else {
        this.errorMsg = 'Please check your code, 6-8 characters';
      }
    },
    formSubmitted: function(e) {       
      if(this.newUser.remember == true) { this.newUser.remember = '1'; }
      if(this.isAdmin == true) {  this.newUser.isAdmin = 1; }
      this.newUser.email = this.newUser.email.trim();
      this.passwordAgain = this.passwordAgain.trim();
      this.newUser.password = this.newUser.password.trim();
      // if(this.newUser.email.toString().trim() !== this.passwordAgain.toString().trim()) { this.errorMsg = 'Passwords must match'; }
      
      if(this.errorMsg == '') {
        if(emailIsValid(this.newUser.email)) {
          if(passwordIsValid(this.newUser.password)) {
            this.saveUser(this.newUser);   
          } else {
            this.errorMsg = 'Please check password: It must have at least: one number, one lowercase and one uppercase letter and at least six characters';
          }
        } else {
          this.errorMsg = 'Please check email';
        }
      }
    },
    ...mapActions(["saveUser", "getCode", "getHouseData"])
  }, // end methods
  watch: {
    // after getHouseData() code execution continues here
    house:function() {
      if (this.house === undefined || this.house.length == 0) { 
        console.log('no house found');
        this.errorMsg = 'Your code does not seem to be a valid code.';
      } else {
       // house was found with code
       console.log('reg: house found');
       this.newUser.houseId = this.house.id;
       // this.user.houseId = this.house.id;
       this.isAdmin = false;
       this.codeAccepted = true;     
      }
    },
    // after saveUser() code execution continues here
    user:function() {
      if (this.user === undefined || this.user.length == 0) { 
        this.errorMsg = 'Please check your input data';
      } else {        
        if(this.user.id == 'userExists') {
          // email exists already in DB
          this.errorMsg = 'Error, email exists already';
          this.newUser = [];
          console.log('Email exists already');
        } else {
          // user save successful
          console.log('2 User saved - this.user:', this.user);
          if(this.isAdmin != 1) {  this.user.houseId = this.house.id; } // NEW2
          if (this.user.remember != '') {
            // save into local storage
            localStorage.setItem("remember", this.user.remember);
            console.log('saved to local storage: ', this.user.remember);
          }
          // forward to next page
          if(this.isAdmin) {
            // user is house admin
            this.newUser.isAdmin = this.isAdmin;        
            this.$router.replace({name: 'management'});
          } else {
            // user is tenant
            this.$router.push({ path: '/booking' });
          }
        }
      }
    },
    // reset error message after 5 seconds
    errorMsg:function() {
      console.log('watch errorMsg');
      var self = this;
      if(this.errorMsg != '') {
        setTimeout(function() {
            self.errorMsg = '';
        }, 5000);
      }
    }
  },                  
  created() {
    this.getCode('00');
  },
  computed: mapGetters(["user", "code", "house"])
};
</script>