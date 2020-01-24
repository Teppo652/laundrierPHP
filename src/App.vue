<template>
  <div id="app">
    <div class="container is-fluid">
                
      <nav class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <!-- logo -->
            <img src="./assets/washing-machine.svg" />
            <router-link id="logo" class="navbar-item"  to="/">Laundrier</router-link>
            <!--
            <a class="navbar-burger" role="button" aria-label="menu" aria-expanded="false"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></a>
            -->
            <span class="navbar-burger burger" data-target="navMenu">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div class="navbar-menu">
            <div class="navbar-start">
              <!-- change language
              <div class="navbar-item has-dropdown is-hoverable"><a class="navbar-link">Language</a>
                <div class="navbar-dropdown">
                  <a class="navbar-item navbar-item-dropdown" href="#">English</a>
                <a class="navbar-item navbar-item-dropdown" href="#">Swedish</a></div>
              </div>
              -->
            </div>
            <div class="navbar-end">
              <router-link class="navbar-item"  to="/booking">My bookings</router-link>               
              <router-link class="navbar-item"  to="/Help">How does it work</router-link>
              <div class="navbar-item">                                                
                <small v-if="!rememberEnded && user.remember"><a @click.prevent="endRemember">Forget me on this device</a></small>
                <small v-if="rememberEnded && user.remember">{{ rememberEnded }}</small>
                <p v-show="user.email" class="loginEmail">Logged in as<br>{{ user.email }}</p>
                <div class="buttons">                  
                  <a v-show="user.email" class="button is-light" href="#" @click.prevent="logout()">Log out</a>
                  <router-link v-show="!user.email" class="button is-light" to="/Register">Register</router-link>
                  <router-link v-show="!user.email" class="button is-light" to="/Login">Login</router-link>
                </div>                
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <router-view/>
    <footer>
      Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
    </footer>
    <!-- loader 
    <div class="loader-wrapper">
      <div class="loader is-loading"></div>
    </div>-->

    <!--  for debugging: 
    <div id="debuggingView">
      DEBUGGING VIEW<br><br>
      user: {{ user }}<br><br>
      house: {{ house }}<br><br>
      <span v-if="this.$route.path == '/booking'">
        machines: {{ machines }}<br><br>
        user.id: {{ user.id}}<br><br><br>
        selectedDay: {{ selectedDay }}<br><br>
        slots: {{ slots }}<br><br>
        bookings: {{ bookings }}<br><br>
        calendarDates: {{ calendarDates }}<br> <br>         
        currentHour: {{ currentHour }}
      </span> 
    </div>-->


  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
export default {
  name: 'App',
  data() {
    return {
      userEmail: null,
      rememberEnded: false,
      machines: [], /* remove these */
      selectedDay: null,
      slots: [],
      calendarDates: [],
      currentHour: null
    };
  },
  methods: {
    logout: function() {
      location.reload();
    },
    endRemember: function() {
      localStorage.removeItem("remember");
      this.rememberEnded = 'Done, this computer will not remember your login info in the future';
    },
    ...mapActions(["saveUser", "getCode", "getHouseData"])
  }, // end methods
  created() {
    
  },
  computed: mapGetters(["bookings", "user", "house"])
};
</script>

<style>
/* all apps styles are here */
html, body {
    height:100%;
    background-color: #00aaf0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.container.is-fluid {
  padding: 0;
}
.navbar {
  padding: 25px 0;
  background-color: #00c3ff;
  border-bottom: solid 2px #347fd2;
}
.navbar-brand {
  font-family: 'Varela Round', 'Avenir', Helvetica, Arial, sans-serif;
}
.navbar-brand img {
  width: 80px;
  height: 80px;
}
.navbar-brand .navbar-item {
  color: #fff;
  font-weight: 600;
  font-family: 'Baloo', cursive;
}
.navbar-item small {
  font-size: .5em;
  margin: 25px;
  width: 100px;
}
#logo {
   color: #fff;
   font-size: 4.4rem;
   margin-top: 28px;
}
.navbar-item, .navbar-link {
    color: #1b68be; 
    font-size: 1.3em;
    font-weight: 600;
    height: 30px;
    margin: 38px 13px;
}
.loginEmail {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: .8rem;
  margin-right: 24px;
  color: #f5f5f5;
}
.title, .subtitle {
    color: #fcfcfc;
}
.subtitle.is-3 {
    font-size: 1.6rem;
    font-weight: 600;
    margin: 10px 0 0 0;
}
.button.is-primary, .tags span {
    background-color: #2ed185;
    color: #fff;
    font-weight: 600;
}
label {
  color: #fff;
}
#booking .tags .bookingTag {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  padding: 22px 4px;
}
#booking .tags .tag, .wide {
  width: 100%;
}
#booking .bookingTag span {
  background-color: #e9c22a;
  border: solid 1px #e1b610;
  margin-left: 14px;
  padding: 4px 8px;
  border-radius: 4px;
}
#booking .tag .delete {
  margin-left: .75rem;
}
#booking .wide span {
  border: solid 1px #ba9e30;
}
#registration label {
  float: left;
}
svg.fa-clock {
    margin: 0 2px 1px 14px;
}
.iconButton {
  border: none;
  background-color: transparent !important;
  color: #fff;
}
.iconButton span label:hover {
  cursor: pointer;
}
#registration .iconButton {
  float: right;
  width: 100%;
}
.iconButton span {
  margin:0 5px !important;
  padding: 0;
}
.iconButton span:hover {
  color: #fff;
}
.iconButton span label {
  margin-left: 5px;
}
.iconButton svg path {
   fill: #f5f5f5;
 }
 #useCommon.is-focused:not(:active), #useCommon:focus:not(:active) {
    box-shadow: none;
}
.button[disabled] {
  opacity: 1;
}
.button.is-active {
  border: solid 1px #58dc9e !important;
}
.button.is-inverted {
  color: #b5b5b5 !important;
  background-color: #d9eaf0 !important;
  font-weight: 100;
}
/* last child btn/tag fix */
.buttons .button:last-child:not(.is-fullwidth) {
    margin-right: .5rem;
}
span.is-passedTime, .button.is-passedTime {
  opacity: .1;
}
#clickXToDeleteText {
  margin: -20px 0 20px 0;
    color: #2C3E50;
}
.tags .tag {
    margin-right: .5rem;
}
.machineName {
  color: red;
}
input.exceedTextLength, textarea.exceedTextLength, select.exceedTextLength {
  color: #be1839 !important;
  font-size: 1rem;
  background-color: pink !important;
  border: solid 1px #be1839 !important;
}
.textLimiter {
  padding-right: 10px;
  margin-top: -28px;
  position: relative;
  color: #d5d5d5;
}
.has-text-danger {
  color: #be1839 !important;
}
.level-item .title {
      margin-right: 50px;
}
.level-item .number {
  margin-right: .4rem;
}
#howDoesItWork .block { 
  background-color: #1d5ea6; 
}
.number {
  background-color: #1b68be;
}
.smallText {
  color: #4d4d4d;
}
.slotTimesExtraText {
  clear: left !important;
  float: left !important;
}
footer {
  flex-grow: 1;
    position: fixed; 
    bottom:0%;
    width:100%; 
    background-color: #044d9e; 
    color: #6392dd;
    opacity: 1;
    font-size: .8rem;
} 
.navbar-burger {
  display: none;
}
#management .level {
  width: 50%;
}
#management .level-left {
  float: left !important;
  margin-right: 10px;
}
#management .level-right {
  float: right !important;
  margin-top: 0 !important;
}
.moreInfoIcon { 
  margin-top: 22px; 
}
.moreInfo {
    float: right;
    margin: -37px 4px 0 0;
    border: none;
    padding: 0 !important;
    width: 34px;
    height: 34px !important;
}
ul {
  list-style: square;
  font-size: 15px;
  font-weight: 600;  
  padding: 7px;
}
ul li {
  text-align: left !important;
  font-weight: 100;
}
.moreInfo svg {
  color: #d6d6d6;
}
#booking .button.is-primary, 
#booking .button.is-danger, 
#booking .button.is-warning,
#booking .is-passedTime {
  width: 47%;       
}
.button.iconButton:focus:not(:active), 
.button.moreInfo:focus:not(:active) {
  box-shadow: none;
}
#info {
  margin: 300px;
}
.loader-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #000;
    z-index: 9999;
    transition: opacity .3s;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    opacity: .5;
}
.loader-wrapper .loader {
    height: 80px;
    width: 80px;
}
#debuggingView {
  font-size: .8rem;
  background-color: #000;
  color: #888;
  padding: 20px;
  text-align: left;
}
/* --------------------------- responsive styles ------------------------------ */
@media only screen and (max-width: 700px) {
  .navbar-burger {
    display: inline;
  }
  .title, .subtitle.is-3 {
    font-size: 1.2rem;
  }
  #management .level-right {
    float: left !important;
    clear: left !important;
  }
}
@media only screen and (max-width: 300px) {  
  .section {
    padding: .3rem .2rem;
  }
  .navbar-brand {
    height: 50px;
  }
  .navbar-brand img {
    width: 40px;
    height: 40px;
    margin-left: 20px;

  }
  #logo {
    font-size: 1.8rem;
    margin-top: 8px;
  }
  .bookingTag, 
  #booking .button.is-primary, 
  #booking .button.is-danger, 
  #booking .button.is-warning,
  #booking .is-passedTime {
    width: 100% !important;       
  } 
  #management .level-right {
    margin-top: 1rem !important;
  }
}
</style>