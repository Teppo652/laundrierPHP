<template>
  <div>      
    <section class="section">
      <div class="container">

          <h2 class="title">Booking settings</h2>
          user: {{ user }}<br>
          house: {{ house }}<br>
           <p class="subtitle is-4">Here the management can set up and edit laundry booking settings</p>
                  <p>How does it work? Fill the form below, enter bookable times and machine names (if you decide that individual machines can be booked). After saving you get access code that you can give to your tenants so they can register and start using the booking system.</p>
                  <br>
          <div class="columns is-centered">
            <div class="column is-5 is-4-desktop">

              <form>
              <span v-show="!registrationCode">
                  <p class="subtitle is-3">1. General info</p>  
                    <!-- house -->                 
                    <div class="field">
                      <div class="control">
                        <label>House name, address or laundry room name</label>
                        <input class="input" type="text" 
                          placeholder="Example: Main street 22 laundry room"
                          v-model="houseName"  
                          :class="(houseName.length>houseNameMaxLength) ? 'exceedTextLength' : '' ">
                        <span v-show="(houseName.length>houseNameMaxLength/2)" class="textLimiter is-pulled-right is-size-7" :class="(houseName.length>houseNameMaxLength) ? 'has-text-danger' : ''">{{ houseNameCharsLeft }}</span>

                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <label>Instructions for booking</label>
                        <textarea v-model="description"  
                          :class="(description.length>descriptionMaxLength) ? 'textarea exceedTextLength' : 'textarea'"
                          rows="5" 
                          placeholder="Example: Laundry machines can be booked max. 7 days in advance. You can have max. 3 active bookings at a time. If you have not started laundry within 15 minutes from the start time, can anybody use your booking. Please keep laundry room clean!">
                        </textarea>
                        <span v-show="(description.length>descriptionMaxLength/2)" class="textLimiter is-pulled-right is-size-7" :class="(description.length>descriptionMaxLength) ? 'has-text-danger' : ''">{{ descriptionCharsLeft }}</span>

                        
                      </div>
                    </div>                  
                  
                  <label>What can be booked?</label>
                  <div class="field m-t-md radio-buttons-as-buttons has-addons">
                    <p class="control">
                        <button @click.prevent="noMachines = 1"
                        class="button is-primary"
                        :class="noMachines ? 'is-active' : 'is-inverted'"
                        >
                            <input type="radio" value="short_term" name="goal[short_or_long_term]" id="goal_short_or_long_term_short_term" />
                            Whole laundry room
                        </button>
                    </p>
                    <p class="control">                    
                        <button @click.prevent="noMachines = 0"
                        class="button is-primary"
                        :class="!noMachines ? 'is-active' : 'is-inverted'"
                        >
                            <input type="radio" value="medium_term" name="goal[short_or_long_term]" id="goal_short_or_long_term_medium_term" />
                            Machines
                        </button>
                    </p>
                  </div>

                  <!-- if Whole laundryroom selected - no field needed -->
                  <!-- if machines selected -->
                  <div class="field">                  
                    <div v-show="!noMachines" class="control">
                      <label>Machine names <small>(separate with ; to add multiple)</small></label>
                      <div class="field has-addons">
                        <div class="control wide">
                          <input class="input" type="text" 
                            placeholder="Example: Washing machine 1"
                            v-model="newMachineName"
                            :class="(newMachineName.indexOf(';') != -1) 
                            ? (newMachineName.length>newMachineNameMaxLength ? 'exceedTextLength' : '') 
                            : ''"
                            >
                          <span v-show="(newMachineName.length>newMachineNameMaxLength/2)" class="textLimiter is-pulled-right is-size-7" :class="(newMachineName.length>newMachineNameMaxLength) ? 'has-text-danger' : ''">{{ newMachineCharsLeft }}</span>
                          
                        </div>
                        <div class="control">
                          <a @click.prevent="addMachine()" class="button is-primary">Add</a>
                        </div>
                      </div>
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
                      </div>
                      <p v-show="(newMachines.length==0)" class="has-text-centered">Add at least 2 machines</p>                          
                    </div>                  
                  </div>
                                  
                  <!-- error message -->
                  <div v-show="errorMsg != ''"  class="notification is-danger">
                    <button v-on:click.prevent="errorMsg = ''" class="delete"></button>
                    <strong>{{ errorMsg }}</strong>
                  </div>

                  <p class="subtitle is-3">2. Booking times 
                    <button @click.prevent="populateWithDefaultValues()" class="button iconButton">
                      <span v-show="!defaultValuesUsed" class="icon is-big is-primary">
                        <i class="fa fa-magic"></i>
                      </span>
                      <span v-show="defaultValuesUsed" class="icon is-big has-background-primary">
                        <i class="fa fa-magic"></i>
                      </span>
                    </button>
                  </p>

                      <!-- time slot length -->
                      <label>How many weeks into the future can booking be made?</label>
                      <div class="field">
                        <div class="select is-fullwidth">
                          <select v-on:change="bookingTimeSpan = $event.target.value" v-model="bookingTimeSpan">
                            <option :value="-1">Booking time range</option>
                            <option v-for="(ts, index) in bookingTimeSpans" 
                                :value="ts.id" 
                                :key="ts.id"
                                >{{ ts.weeks }} <span v-if="index==0">week</span><span v-else>weeks</span>
                            </option>
                          </select>
                        </div>
                      </div>

                      <!-- time slot length -->
                      <label>How many hours is one booking?</label>
                      <div class="field">
                        <div class="select is-fullwidth">
                          <select v-on:change="slotLength = $event.target.value" v-model="slotLength">
                            <option :value="-1">Time slot length</option>
                            <option v-for="(s, index) in slotLengths" 
                                :value="s" 
                                :key="s"
                                >{{ s }} <span v-if="index==0">hour</span><span v-else>hours</span>
                            </option>
                          </select>
                        </div>
                      </div>
                      
                      <!-- slot start time -->
                      <label>Laundry room can be used between times</label>
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
                      <small>Last slot of the day starts at End hour</small><br>

                      <!-- max bookings per user -->
                      <label>How many bookings can one user have?</label>
                      <div class="field">
                        <div class="select is-fullwidth"> 
                          <select v-on:change="maxBookingsPerUser = $event.target.value" v-model="maxBookingsPerUser">
                            <option :value="-1">Maximum bookings per user</option>
                            <option v-for="mb in maxBookings" 
                                :key="mb"
                                >{{ mb }}
                            </option>
                          </select>
                        </div>
                      </div>

                      <!-- visible user information -->
                      <label>What information is shown in a bookings to other users?</label>
                      <div class="field">
                        <div class="select is-fullwidth">
                          <select v-on:change="visibleUserInfo = $event.target.value" v-model="visibleUserInfo">
                            <option :value="-1">Visible information</option>
                            <option :value="0">Nothing</option>
                            <option :value="1">Apartment number</option>
                            <option :value="2">Lastname</option>
                          </select>
                        </div>
                      </div>

                  <!-- save or update all -->
                  <div class="field">
                    <div class="control">
                      <button @click.prevent="save" class="button is-primary is-fullwidth" type="submit">Save</button>
                    </div>
                  </div>

                </span> <!-- if registrationCode -->
                
                <span v-show="registrationCode" >
                  <p class="subtitle is-3">Get code</p> 
                  <!-- access code -->                
                  <div class="field">
                    <label>Give this registration code to your tenants so they can register and start using the booking app</label>
                    <div class="control">
                      <input class="input is-fullwidth is-size-6 has-background-warning has-text-centered" type="text" :value="!registrationCode ? 'Registration code will appear here' : registrationCode">
                    </div>
                    <label>Anybody who knows the code can register.</label>                  
                  </div>
                  
                  <!-- Go to booking btn 
                  <div class="field">
                    <div class="control">
                      <button @click.prevent="forwardToNextPage()" class="button is-primary is-fullwidth" type="submit">Go to booking page</button>
                    </div>
                  </div>
                  -->
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
      houseNameMaxLength: 50,
      houseNameCharsLeft: 0,
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
      descriptionMaxLength: 1000,
      descriptionCharsLeft: 0,
      newMachineName: '',
      newMachineNameMaxLength: 25,
      newMachineCharsLeft: 0,
      newMachines: [],
      defaultValuesUsed: false,
      houseSaved: false,
      errorMsg: ''
    }
  },
  methods: {
  addMachine: function () {
      // TODO: change first letter into capital, remove special characters        
      if(this.newMachineName != '') {
          if(this.newMachineName.indexOf(";") == -1) {                
              // one item
              this.newMachines.push({ 'name': this.newMachineName, 'orderId': this.newMachines.length });
          } else {
              // multiple items
              let machinesArr = this.newMachineName.split(";");
              let counter = machinesArr.length;
              for( let i = 0; i < machinesArr.length; i++){ 
                  if(machinesArr[i] != '') {
                      this.newMachines.push({ 'name': machinesArr[i], 'orderId': counter });
                      counter++;
                  }
              }
          }
          this.newMachineName = '';
      }
  },
  saveMachines: function (houseId) {
      this.newMachines.forEach(function (m) {
        console.log('Adding machine: houseId' + houseId + ' name' + m.name + ' orderId' + m.orderId);
        db.collection('machines').add({ 
            houseId: houseId,
            name: m.name,
            orderId: m.orderId
          })
          .then(docRef => {  
            //this.successMsgText = 'Added: ' + startTime + ':00 - ' + endTime + ':00 ' + this.machines.find(m => m.id == machineId).name;
            //this.successMsg = true;  
          })
          .catch(error => {
            console.error('Error in saving machines: ', error)
          });        
      }); // forEach
  },
  deleteNewMachine: function (orderId) {
        for( let i = 0; i < this.newMachines.length; i++){ 
          if ( this.newMachines[i].orderId === orderId) {
            this.newMachines.splice(i, 1); 
            i--;
          }
        }
  },
  save: function () {
        // validate form
        console.log('validate form');
        /* 
        if(this.houseName.length<3) { this.errorMsg+= " Please enter House, address or laundryroom name"; }
        if(this.noMachines == false && this.newMachineName.length<2) { this.errorMsg+= " You must add at least 2 machines or select \"Whole laundryroom\" as what can be booked."; }
        if(this.slotStart < this.slotEnd) { this.errorMsg+= " Check start- and end hour."; }
        */
        if(this.noMachines == false && this.newMachines.length<1) { this.errorMsg+= " You must add at least 2 machines or select \"Whole laundryroom\" as what can be booked."; }
        
        if(this.bookingTimeSpan == -1) { this.errorMsg+= " Please select Booking time range. "; }
        if(this.slotLength == -1) { this.errorMsg+= " Please select Time slot length. "; }
        if(this.maxBookingsPerUser == -1) { this.errorMsg+= " Please select Maximum bookings per user. "; }
        if(this.visibleUserInfo == -1) { this.errorMsg+= " Please select Visible information. "; }
// TODO Test if no machines were given
// TODO check that there are at least 2 machines - if machines selected
// TODO validate that machine names are unique
console.log('validate form - errorMsg:', this.errorMsg);
       if(this.errorMsg.length < 1) {
        // sort and join machines
        this.newMachines.sort(function(a, b) {
          return parseFloat(a.orderId) - parseFloat(b.orderId);
        });
        let machines = [];
        this.newMachines.forEach( item => machines.push(item.name) );
        let machineNames = machines;
        if(machineNames.indexOf(";") == -1) { machineNames = machines.join(";"); }
console.log('validate form - machineNames:', machineNames);
        
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
          "name": this.name.trim(),
          "aptNumber": this.aptNumber.trim(),
        };
        this.saveHouse(house);
      } else {
        console.log('there were errors');
      }
  },
  // clicking the magic wand icon sets default number time slot values in form (toggle)
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
    ...mapActions(["saveHouse", "saveUser", "getCode", "getHouseData"])
  }, 
  watch: {
    // after saving house execution continues here
    house:function() {             
      console.log('house watch - this.house:', this.house);      
      // if (this.house.id != '') {
      if (this.house === undefined || this.house.length == 0) { 
        this.errorMsg = 'Oh no! - Something went wrong in saving the house info.';
        console.log('house save error');
      } else {
        console.log('house saved');
        // show tenant reg code      
        console.log('house save erthis.house.registrationCode: ', this.house.registrationCode);
        this.registrationCode = this.house.registrationCode;
        
        // this.$router.replace({name: 'booking'});     
      }
    }
  },
  computed: { 
    // displays number of characters left
    houseNameCharsLeft() {
        return (this.houseNameMaxLength - this.houseName.length) + " / " + this.houseNameMaxLength;
      },
    descriptionCharsLeft() {
        return (this.descriptionMaxLength - this.description.length) + " / " + this.descriptionMaxLength;
    },
    newMachineCharsLeft() {
        if(this.newMachineName.indexOf(";") == -1) {
          // if one machine name given (not multiple separated with ; )
          return (this.newMachineNameMaxLength - this.newMachineName.length) + " / " + this.newMachineNameMaxLength;
        }
    },
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