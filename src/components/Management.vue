<template>
  <div>      
    <section class="section">
      <div id="management" class="container">

          <h2 class="title">Booking settings</h2>
          user: {{ user }}<br>
          house: {{ house }}<br>
           <p class="subtitle is-4">Here the management can set up and edit laundry booking settings</p>
                  <p>How does it work? Fill the form below, enter bookable times and machine names (if you decide that individual machines can be booked). After saving you get access code that you can give to your tenants so they can register and start using the booking system.</p>
                  <br>
          <div class="columns is-centered">
            <div class="column is-5 is-4-desktop">

              <form>
              <span id="registration" v-show="!registrationCode">
                  <p class="subtitle is-3">1. General info</p>  
                    <!-- house -->
                    <div class="field">
                      <div class="control">
                        <label>House name, address or laundry room name</label>
                        <input class="input" type="text" 
                          placeholder="Example: Main street 22 laundry room"
                          v-model="houseName"
                          :class="charsLeft(50, houseName)[0] ? 'exceedTextLength' : ''"
                          >
                        <span class="textLimiter is-pulled-right is-size-7"  :class="charsLeft(50, houseName)[0] ? 'has-text-danger' : ''">{{ charsLeft(50, houseName)[1] }}</span>
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <label>Instructions for booking</label>
                        <textarea v-model="description"
                          class="textarea"
                          :class="charsLeft(2000, description)[0] ? 'exceedTextLength' : ''"
                          rows="5" 
                          placeholder="Example: Laundry machines can be booked max. 7 days in advance. You can have max. 3 active bookings at a time. If you have not started laundry within 15 minutes from the start time, can anybody use your booking. Please keep laundry room clean!">
                        </textarea>
                        <span class="textLimiter is-pulled-right is-size-7" style="padding-right:22px"  :class="charsLeft(2000, description)[0] ? 'has-text-danger' : ''">{{ charsLeft(2000, description)[1] }}</span>
                      </div>
                    </div>                  
                  
                  <label>What can be booked?</label>

                  <div class="field m-t-md radio-buttons-as-buttons has-addons wide">
                    <p class="control wide">
                        <button @click.prevent="noMachines = 1, errorMsg = ''"
                        class="button is-primary wide"
                        :class="noMachines ? 'is-active' : 'is-inverted'"
                        >
                            <input type="radio" value="short_term" name="goal[short_or_long_term]" id="goal_short_or_long_term_short_term" />
                            Whole laundry room
                        </button>
                    </p>
                    <p class="control wide">                    
                        <button @click.prevent="noMachines = 0"
                        class="button is-primary wide"
                        :class="!noMachines ? 'is-active' : 'is-inverted'"
                        >
                            <input type="radio" value="medium_term" name="goal[short_or_long_term]" id="goal_short_or_long_term_medium_term" />
                            Machines
                        </button>
                    </p>
                  </div>

                  <!-- if Whole laundryroom selected - no field needed -->
                  <!-- if machines selected -->
                  <!-- NEW -->
                <!--<div v-show="!noMachines" class="control">-->
                <div :style="{visibility: !noMachines ? 'visible' : 'hidden'}" class="control">
                  
                  <label>Machine names <small class="smallText"> Separate multiple with ; </small></label>
                  <div class="field has-addons is-fullWidth" style="clear:left">
                    <p v-show="!noMachines" class="control has-icons-right wide">
                    <input class="input wide" type="text" 
                            placeholder="Dryer 1"
                            v-model="newMachineName"                            
                            style="z-index:0"
                            :class="newMachineName.indexOf(';') == -1 && charsLeft(3, newMachineName)[0] ? 'exceedTextLength' : ''
                            ">                      
                      <span class="is-right">
                        <span class="textLimiter is-pulled-right is-size-7" 
                                :class="newMachineName.indexOf(';') == -1 && charsLeft(3, newMachineName)[0] 
                                ? 'has-text-danger' 
                                : ''">{{ charsLeft(3, newMachineName)[1] }}</span> 
                      </span>
                    </p>
                    <div class="control">
                      <a @click.prevent="addMachine(3)" class="button is-primary"
                             :disabled="newMachineName.indexOf(';') == -1 && charsLeft(3, newMachineName)[0]"
                          >Add</a>
                    </div>
                  </div>

                  <!-- OLD -------------------------------- -->
                  <div class="field">                  
                    <div>
                      <!--
                        <div v-show="!noMachines" class="control">
                      <label>Machine names <small>(separate with ; to add multiple)</small></label>
                      <div class="field has-addons">
                        <div class="control wide">
                          <input class="input" type="text" 
                            placeholder="Example: Washing machine 1"
                            v-model="newMachineName"                            
                            style="z-index:0"
                            :class="newMachineName.indexOf(';') == -1 && charsLeft(3, newMachineName)[0] ? 'exceedTextLength' : ''
                            ">
                          <span class="textLimiter is-pulled-right is-size-7" 
                                :class="newMachineName.indexOf(';') == -1 && charsLeft(3, newMachineName)[0] 
                                ? 'has-text-danger' 
                                : ''">{{ charsLeft(3, newMachineName)[1] }}</span>                      
                        </div>
                        <div class="control">
                          <a @click.prevent="addMachine(3)" class="button is-primary"
                             :disabled="newMachineName.indexOf(';') == -1 && charsLeft(3, newMachineName)[0]"
                          >Add</a>
                        </div>
                      </div>
                      -->
                      <!-- machine names list   newMachines -->
                      <!--
                      <span v-for="b in bookings" :key="b.id"
                      v-show="b.userId == currUserId"  :text="dispDate = getSingleDaysInfo(b.date, true)"
                        -->
                      <div class="tags">
                          <span v-for="m in newMachines" :key="m.orderId"
                              class="tag is-primary is-medium">
                              {{ m.name }}
                              <button @click.prevent="deleteNewMachine(m.orderId)" class="delete is-small"></button>
                          </span>
                          <button v-if="newMachines.length > 5" @click.prevent="newMachines = []" class="button is-warning">Remove all machines</button>
                      </div>
                      <p v-show="(newMachines.length==0)" class="has-text-centered" style="margin-top: -20px;">
                        Add at least 2 machines
                      </p>
                    </div>                  
                  </div>
                                  
                  <!-- error message -->
                  <div v-show="errorMsg != ''"  class="notification is-danger">
                    <button v-on:click.prevent="errorMsg = ''" class="delete"></button>
                    <strong>{{ errorMsg }}</strong>
                  </div>
                </div>

                  <p class="subtitle is-3">2. Booking times</p> 
                    <button id="useCommon" @click.prevent="populateWithDefaultValues()" class="button iconButton" style="float:unset">
                      <span v-show="!defaultValuesUsed" class="icon is-big">
                        <i class="fa fa-magic"></i>
                        <label>Use suggested times</label>
                      </span>
                      <span v-show="defaultValuesUsed" class="icon is-big">
                        <i class="fa fa-magic"></i>
                        <label>Reset times</label>
                      </span>
                    </button>                  

                      <!-- time slot length -->
                      <label>How many weeks into the future can a booking be made?</label>
                      <div class="field">
                        <div class="select is-fullwidth">
                          <select v-on:change="bookingTimeSpan = $event.target.value" v-model="bookingTimeSpan">
                            <option :value="-1">Select</option>
                            <option v-for="(ts, index) in bookingTimeSpans" 
                                :value="ts.id" 
                                :key="ts.id"
                                >{{ ts.weeks }} <span v-if="index==0">week</span><span v-else>weeks</span>
                            </option>
                          </select>
                        </div>
                      </div>

                      <!-- booking length -->
                      <label>How many hours is one booking?</label>
                      <div class="field">
                        <div class="select is-fullwidth">
                          <select v-on:change="slotLength = $event.target.value" v-model="slotLength">
                            <option :value="-1">Select</option>
                            <option v-for="(s, index) in slotLengths" 
                                :value="s" 
                                :key="s"
                                >{{ s }} <span v-if="index==0">hour</span><span v-else>hours</span>
                            </option>
                          </select>
                        </div>
                      </div>
                      
                      <!-- slot start and end time -->
                      <label>Laundry room can be used between times</label>
                      <div class="field level is-fullWidth" style="clear:left">
                        <div class="select level-left">
                          <select v-on:change="slotStart = $event.target.value" 
                            v-model="slotStart">
                            <option :value="-1">Start hour</option>
                            <option v-for="hourCounter in 24" 
                            :key="hourCounter"
                            :value="hourCounter-1"
                            >{{ hourCounter-1 }}:00</option>
                          </select>
                        </div>
                        <div class="select level-right">
                          <select v-on:change="slotEnd = $event.target.value" v-model="slotEnd"
                            :class="slotStart>-1 && slotEnd>-1 && slotStart>=slotEnd ? 'exceedTextLength' : ''">
                            <option :value="-1">End hour</option>
                            <option v-for="hourCounter in 24" 
                            :key="hourCounter"
                            :value="hourCounter-1"
                            >{{ hourCounter-1 }}:00</option>
                          </select>
                        </div>
                      </div>

                      <!-- OLD 
                      <div class="field has-addons">
                        <div class="column is-fullwidth noPadding">
                          <div class="control">
                              <div class="select">
                                <select v-on:change="slotStart = $event.target.value" v-model="slotStart">
                                  <option :value="-1">Start hour</option>
                                  <option v-for="hourCounter in 24" 
                                  :key="hourCounter"
                                  :value="hourCounter-1"
                                  >{{ hourCounter-1 }}:00</option>
                                </select>
                              </div>
                          </div>
                        </div>                      
                        <div class="column is-fullwidth noPadding">
                          <div class="control">
                              <div class="select is-pulled-right">
                                <select v-on:change="slotEnd = $event.target.value" v-model="slotEnd">
                                  <option :value="-1">End hour</option>
                                  <option v-for="hourCounter in 24" 
                                  :key="hourCounter"
                                  :value="hourCounter-1"
                                  >{{ hourCounter-1 }}:00</option>
                                </select>
                              </div>                            
                          </div>
                        </div>
                      </div>
                      -->
                      <small id="slotTimesExtraText">Last slot of the day starts at End hour</small>

                      <!-- max bookings per user -->
                      <label style="clear:left">How many bookings can one user have?</label>
                      <div class="field">
                        <div class="select is-fullwidth"> 
                          <select v-on:change="maxBookingsPerUser = $event.target.value" v-model="maxBookingsPerUser">
                            <option :value="-1">Select</option>
                            <option v-for="mb in maxBookings" :key="mb">{{ mb }}</option>
                          </select>
                        </div>
                      </div>

                      <!-- visible user information -->
                      <label>What information can user see about other users?</label>
                      <div class="field">
                        <div class="select is-fullwidth">
                          <select v-on:change="visibleUserInfo = $event.target.value" v-model="visibleUserInfo">
                            <option :value="-1">Select</option>
                            <option :value="0">Nothing</option>
                            <option :value="1">Apartment number</option>
                            <option :value="2">Lastname</option>
                          </select>
                        </div>
                      </div>

                  <!-- save or update all -->
                  <div class="field">
                    <div class="control">
                      <button @click.prevent="saveHouseInfo" class="button is-primary is-fullwidth" type="submit">Save</button>
                    </div>
                  </div>

                </span>
                
                <span v-show="registrationCode">                  
                  <p class="subtitle is-3">Congratulations! Your laundry room booking page has been created</p>
                  <br><br>
                  <p class="subtitle is-3">Tenant registration code</p> 
                  <!-- tenant registration code -->                
                  <div class="field">
                    <label>Give this registration code to your tenants so they can register and start using the booking app</label>
                    <div class="control">
                      <input class="input is-fullwidth is-size-6 has-background-warning has-text-centered" type="text" :value="!registrationCode ? 'Registration code will appear here' : registrationCode">
                    </div>
                    <label>Anybody who knows the code can register and make bookings.</label>                  
                  </div>
                  
                  <!-- go to booking page btn -->
                  <div class="field">
                    <div class="control">
                      <button @click.prevent="forwardToNextPage()" class="button is-primary is-fullwidth" type="submit">Now go test your new booking page</button>
                    </div>
                  </div>
                 
                 </span>

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
  name: 'management',
  data () {
    return {
      registrationCode: 0, 
      houseName: 'Main street 22 laundry room',
      noMachines: 0,
      bookingTimeSpans: [{ id: 7, weeks: 1 },{ id: 14, weeks: 2 },{ id: 28, weeks: 4 },{ id: 56, weeks: 8 }],
      bookingTimeSpan: -1,
      slotLengths: [1,2,3,4,5,6],
      slotLength: -1,
      maxBookings: [1,3,5,7,10,20,30,40,50],
      maxBookingsPerUser: -1,
      hourCounter: 0,
      slotStart: -1,
      slotEnd: -1,
      name: 'Test user name',
      aptNumber: 'Apt 784',
      visibleUserInfo: -1,
      description: 'Laundry machines can be booked max. 7 days in advance. You can have max. 3 active bookings at a time. If you have not started laundry within 15 minutes from the start time, can anybody use your booking. Please keep laundry room clean!',
      newMachineName: '',
      newMachines: [],
      defaultValuesUsed: false,
      houseSaved: false,
      errorMsg: ''
    }
  },
  methods: {
    addMachine: function (maxLength) {
      // TODO: change first letter into capital, remove special characters        
      if(this.newMachineName != '') {
          if(this.newMachineName.split(";").length > 50) { this.errorMsg = 'Max 50 machines allowed.'; } // validate number of machines
          if(this.newMachineName.indexOf(";") == -1) {    
              // TODO: check for doubles
              // one item entered
              if(this.newMachineName.length > maxLength) { 
                this.errorMsg = 'Machine name is too long, it can be max ' + maxLength + ' characters';                     
              } else {
                this.newMachines.push({ 'name': this.newMachineName, 'orderId': this.newMachines.length });
              }
          } else {
              // multiple items entered
              let machinesArr = this.newMachineName.split(";");
              let counter = machinesArr.length;
              for( let i = 0; i < machinesArr.length; i++){ 
                  if(machinesArr[i] != '') {
                    if(machinesArr[i].length > maxLength) { 
                      this.errorMsg = 'One machine name is too long, it can be max ' + maxLength + ' characters';                    
                    } else {
                      this.newMachines.push({ 'name': machinesArr[i], 'orderId': counter });
                      counter++;
                    }
                  }
              }
          }
          this.newMachineName = '';
      }
    },
    deleteNewMachine: function (orderId) {
        for( let i = 0; i < this.newMachines.length; i++){ 
          if ( this.newMachines[i].orderId === orderId) {
            this.newMachines.splice(i, 1); 
            i--;
          }
        }
    },
    saveHouseInfo: function () {
      // validate form
      console.log('validate form');
      if(this.houseName.length<3) { this.errorMsg+= " Please enter House, address or laundryroom name"; }
      if(this.noMachines == true && this.newMachineName.length<2) { this.errorMsg+= " You must add at least 2 machines or select \"Whole laundryroom\" as what can be booked."; }
      if(this.slotStart > this.slotEnd) { this.errorMsg+= " Check start- and end hour."; }
      if(this.noMachines == false && this.newMachines.length<1) { this.errorMsg+= " You must add at least 2 machines or select \"Whole laundryroom\" as what can be booked."; }
      
      if(this.bookingTimeSpan == -1) { this.errorMsg+= " Please select Booking time range. "; }
      if(this.slotLength == -1) { this.errorMsg+= " Please select Time slot length. "; }
      if(this.maxBookingsPerUser == -1) { this.errorMsg+= " Please select Maximum bookings per user. "; }
      if(this.visibleUserInfo == -1) { this.errorMsg+= " Please select Visible information. "; }

      if(this.errorMsg.length < 1) {
        // sort and join
        if(this.noMachines == true) { this.newMachines.push({ 'name': 'dummy', 'orderId': 0 }); }
        this.newMachines.sort(function(a, b) {
          return parseFloat(a.orderId) - parseFloat(b.orderId);
        });
        let machines = [];
        this.newMachines.forEach( item => machines.push(item.name) );
        let machineNames = machines;
        if(machineNames.indexOf(";") == -1) { machineNames = machines.join(";"); }
        // save house info
        let house = {
          "adminUserId": this.user.id,
          "registrationCode": '', 
          "bookingTimeSpan": parseInt(this.bookingTimeSpan),
          "description": this.description.trim(),
          "houseName": this.houseName.trim(),
          "maxBookingsPerUser": parseInt(this.maxBookingsPerUser),
          "slotEnd": parseInt(this.slotEnd),
          "slotLength": parseInt(this.slotLength),
          "slotStart": parseInt(this.slotStart),
          "noMachines": this.noMachines,
          "machineNames": machineNames,
          //"name": this.name.trim(),
          //"aptNumber": this.aptNumber.trim(),
          "visibleUserInfo": this.visibleUserInfo
        };
        this.saveHouse(house);
      }
    },
    // clicking the magic wand icon sets default times in form
    populateWithDefaultValues: function () {
      if(!this.defaultValuesUsed) {
        this.bookingTimeSpan = 28;
        this.slotLength = 2;
        this.maxBookingsPerUser = 5;
        this.slotStart = 8;
        this.slotEnd = 20;
        this.visibleUserInfo = 0;
        this.defaultValuesUsed = true;
      } else {
        this.bookingTimeSpan = -1;
        this.slotLength = -1;
        this.maxBookingsPerUser = -1;
        this.slotStart = -1;
        this.slotEnd = -1;
        this.visibleUserInfo = -1;
        this.defaultValuesUsed = false;
      }
    },
    ...mapActions(["saveHouse", "saveUser", "getCode", "getHouseData"]),
    // calculates number of characters left, returns array: [is limit exceeded, characters left / max]
    charsLeft(maxLen, str) {
        return [ str.length > maxLen ? true : false, 
                maxLen - str.length + " / " + maxLen ];
    },
    forwardToNextPage() {
      this.$router.replace({name: 'booking'});
    }
  }, 
  watch: {
    // after save houseInfo code execution continues here
    house:function() {             
      console.log('house watch - this.house:', this.house);
      if (this.house === undefined || this.house.length == 0) { 
        this.errorMsg = 'Oh no! - Something went wrong in saving the house info.';
        console.log('house save error');
      } else {
        console.log('house saved');
        // show tenant reg code              
        this.registrationCode = this.house.registrationCode;        
        this.$router.replace({name: 'booking'});     
      }
    }
  },
  computed: mapGetters(["user", "code", "house"])
}
</script>

<style scoped>
  .noPadding {
    padding: 0;
  }
  label, form label {
    text-align: left;
    color: #fff;
  }
  .radio-buttons-as-buttons input {
      display: none;
  }
</style>