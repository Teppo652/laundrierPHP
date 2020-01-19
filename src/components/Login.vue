<template>
    <div>      
      <section class="section">
        <div class="container has-text-centered">

          <h2 class="title">Login</h2>
          user: {{ user }}<br>
          house: {{ house }}<br>

          <div class="columns is-centered">
            <div class="column is-5 is-3-desktop">              
              <form>
                <!-- error 
                <div v-if="error" class="alert alert-danger">{{error}}</div> -->

                <!-- error msg --> 
                <div v-show="error" class="field">
                  <div class="control">
                      <div class="notification is-danger">
                        {{error}}
                      </div>
                  </div>
                </div>

                <!-- email -->  
                <div class="field">
                  <div class="control">
                    <label for="email">Email</label>
                    <input id="email"
                    type="email"
                    class="input" 
                    name="email"
                    value="test@test.com"
                    required
                    autofocus
                    placeholder="Email"
                    v-model="lUser.email"
                  />
                  </div>
                </div>

                <!-- password  
                <div class="field">
                  <div class="control">
                    <label for="password">Password</label>
                    <input id="password"
                      type="password"
                      class="input" 
                      name="password"
                      value="test"
                      required
                      placeholder="Password"
                      v-model="lUser.password"
                    />
                  </div>
                </div>-->
                <!-- password -->  
                <div class="field">
                  <p class="control has-addons">
                    <label for="password">Password</label>
                    <input id="password"
                      type="password"
                      class="input"
                       placeholder="Password"
                      v-model="lUser.password"
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
                  <ul>Password includes at least:
                    <li>One number</li>
                    <li>One lowercase letter</li>
                    <li>One uppercase letter</li>
                    <li>Is at least six characters long</li>
                  </ul>
                </div>

                <!-- remember --> 
                <div class="field">
                  <div class="control">
                    <label class="checkbox">
                    <input v-model="lUser.remember" type="checkbox">
                      Remember me
                    </label>
                  </div>
                </div>



                <!-- login btn        :disabled="form.email == null || form.password.length == null"      -->  
                <div class="field">
                  <div class="control">
                    <button 
                        class="button is-primary is-fullwidth"
                        @click.prevent="login()">Login</button>

                        

                  </div>
                </div>

                <small>
                  <router-link class="has-text-light has-text-centered" to="/Register">Did you mean to register?</router-link>
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
  name: "login",
        data() {
            return {
              lUser: {
                email: "tester@test.com",
                password: "salasana",
                remember: false
              },
              error: null,
              passwordHelper: false
            }
        },
        methods: {
          login() {
            console.log('Login this.error:', this.error);
            console.log('Login this.lUser:', this.lUser);
            this.lUser.email = this.lUser.email.trim();
            this.lUser.password = this.lUser.password.trim();
            if(emailIsValid(this.lUser.email)) {
              if(passwordIsValid(this.lUser.password)) {
                if(this.lUser.remember == true) { this.lUser.remember = '1'; }
                this.loginUser(this.lUser);
                console.log('Login this.user:', this.lUser);
              } else {
                this.errorMsg = 'Please check password: It must have at least: one number, one lowercase and one uppercase letter and at least six characters';
              }
            } else {
              this.errorMsg = 'Please check email';
            }

            // if validated
             
          },
          ...mapActions(["loginUser", "getHouseData"])
        }, // end methods
        watch: {
          // after loginUser() code execution continues here
          user() {
            console.log('user watch - this.user:', this.user);
            if (this.user === undefined || this.user.length == 0) { 
              this.error = 'Please check your email and password';
            } else {
              console.log('user found - this.user:', this.user);
               if (this.user.remember != '') {
                // save into local storage
                localStorage.setItem("remember", this.user.remember);
                console.log('saved to local storage: ', this.user.remember);
              }
              let arr = [this.user.houseId, '-1'];
              this.getHouseData(arr);
              this.$router.replace({name: 'booking'});
            }
          },
          // after getHouseData() code execution continues here
          house() {          
            console.log('house watch - this.house:', this.house);
            // if (this.house.length>0) {
            if (this.house === undefined || this.house.length == 0) {
              this.error = 'Oh no! - Unfortunately the Laundry room you are registered to could not be found, please contact your house management.';
              console.log('no house found');
            } else {
            // house was found with code
              console.log('house found');
            //this.user.houseId = this.house.id
            this.isAdmin = false;
            this.codeAccepted = true;
            } 
          }
        },               
        created() {
          let remember = localStorage.getItem("remember");
          if(remember) {
            console.log('remember:', remember);
            this.loginUser(this.lUser); // if local storage string found - redirect to booking
          }
        },
        computed: mapGetters(["user", "house"])      
};
</script>

<style scoped>


</style>