<template>
  <div>   

    <div v-if="!house" id="info" class="has-text-centered">Logged out</div>

    <section v-if="house" id="booking" class="section">
      <div class="container has-text-centered">
          
          <h3 class="title">Laundry room booking 
            <button v-show="house.description.length>0" @click.prevent="showInfoPanel = showInfoPanel ? false : true" class="button iconButton">
              <span class="icon is-big is-primary">
                <i class="fas fa-info-circle fa-2x"></i>
              </span>
            </button>
          </h3>
          <div v-if="house.adminUserId == user.id"> 
            Tenant registration code: {{ house.registrationCode }}
          </div>

          <div class="columns is-centered">
            <div class="column is-5 is-5-desktop">              
              <p class="subtitle is-4">{{ house.houseName }}</p>
              <!--<p v-show="showInfoPanel && house.description.length>0" class="has-text-white-bis">{{ house.description }}</p>-->
              <div v-show="showInfoPanel && house.description.length>0" class="notification is-link">{{ house.description }}</div>

              <form>    
                <!-- my bookings title -->
                <h5 class="title">You have                      
                    {{ totBookings = bookings.filter(b => b.userId == user.id).length }} booking<span v-if="totBookings!=1">s</span>

                  <button @click.prevent="showBookingPanel = showBookingPanel ? false : true" class="button iconButton">
                    <span v-show="!showBookingPanel" class="icon is-big is-primary">
                      <i class="fas fa-plus-circle fa-2x"></i>
                    </span>
                    <span v-show="showBookingPanel" class="icon is-big is-primary">
                      <i class="fas fa-minus-circle fa-2x"></i>
                    </span> 
                  </button>
                </h5>
                
                <!-- my bookings list -->
<!-- TODO add Texts: This week, next week with divider -->
                <!-- v-show="b.userId == user.id && b.startTime >= currentHour" -->
                 <div class="tags wide">
                  <span v-show="b.userId == user.id" v-for="b in bookings" :key="b.id"                          
                          :text="dispDate = getSingleDaysInfo('20'+b.date, true)"
                          class="tag is-medium is-fullwidth bookingTag is-warning"
                  >{{ dispDate }} &nbsp; <i class="far fa-clock"></i> &nbsp;{{ String(b.startTime).padStart(2, '0') }}:00 <span v-if="!house.noMachines" class="machineName">{{ machines.find(m => m.id == b.machineId).name }}</span>
                  <button v-on:click.prevent="deleteBooking(b.id)" class="delete is-small"></button>                  
                  </span>
                </div>                
                <p v-if="totBookings == 0" class="has-text-white-bis">You have no bookings, click plus button to make them.</p>
                <p v-if="totBookings > 0" id="clickXToDeleteText">Click x to delete booking</p>
                
                <!-- error message -->
                <div v-show="errorMsg != ''" class="notification is-danger">
                  <button v-on:click.prevent="errorMsg = ''" class="delete"></button>
                  <strong>{{ errorMsg }}</strong>
                </div>

                
                <div v-show="showBookingPanel">
                  Color legend<br>
                  <span class="tag is-warning is-normal">Booked to you</span> &nbsp;
                  <span class="tag is-primary is-normal">Free</span> &nbsp;
                  <span class="tag is-danger  is-normal">Booked to somebody else</span>
                  <br><br>
                </div>

                <!-- add a new booking -section -->
                <section v-show="showBookingPanel">
                  <p class="subtitle is-3">Add booking</p>
                  <div class="field">
                    <div class="select is-fullwidth">
                      <!-- date droplist -->
                      <select v-on:change="selectedDay = $event.target.value">
                        <option v-for="(cd, index) in calendarDates" 
                                :key="cd.id"
                                :value="cd.id"
                                v-if="index < house.bookingTimeSpan"
                        >{{ getDayName(cd.dayNum, index) }} {{ cd.disp }}
                        </option>
                      </select>
                    </div>
                  </div>     

                  <div v-if="!house.noMachines" class="field">
                    <div class="select is-fullwidth">
                      <!-- machine droplist -->
                      <select v-on:change="selectedMachine = $event.target.value">
                        <option :value="-1">All laundry room machines</option>
                        <option v-for="m in machines" 
                            :value="m.id" 
                            :key="m.id"
                            >{{ m.name }}
                        </option>
                      </select>
                    </div>
                  </div><br>
<!-- TODO add button/checkbox: Show only available times -->
                  <div class="buttons">
                    <!-- NEW 
                    <span v-for="(m, index) in machines" :key="index" :value="m.id" v-show="selectedMachine == -1 || m.id == selectedMachine">
                        <p v-if="!house.noMachines" class="subtitle is-3">{{ m.name }}</p>
                        <p v-else class="subtitle is-3">Laundry room</p>
                        Click to book a time<br>
                        
                        <!-- iterate time slots 
                        <span v-for="s in slots" :key="s" :value="s">
                          <span v-for="b in bookings" :key="b" :value="b">
                            <button v-if="b.date == selectedDay && b.startTime == s && b.machineId == m.id" class="button"                         
                              v-bind:class="user.id == b.userId ? 'is-warning' : 'is-danger'"
                              disabled>
                              <i class="far fa-clock"></i> &nbsp; {{ String(s).padStart(2, '0') }}:00 - {{ String(parseInt(s) + parseInt(house.slotLength)).padStart(2, '0') }}:00 
                              <span v-if="b.aptNumber || b.name">Apt:{{ b.aptNumber }} N:{{ b.name }}</span>
                            </button>
                          <button v-if="!(b.date == selectedDay && b.startTime == s && b.machineId == m.id)" 
                              class="button is-primary" v-on:click.prevent="saveBooking(m.id, parseInt(selectedDay), s)">
                            <i class="far fa-clock"></i> &nbsp; {{ String(s).padStart(2, '0') }}:00 - {{ String(parseInt(s) + parseInt(house.slotLength)).padStart(2, '0') }}:00 
                          </button>
                          
                          </span> 
                          </span>
                    </span> <!-- end machines -->  


                    <!-- OLD -->
                    <!--<span v-for="m in machines"  :key="m" v-show="selectedMachine == -1 || m.id == selectedMachine"> -->                      
                    <span v-for="(m, index) in machines" :key="index" :value="m.id" v-show="selectedMachine == -1 || m.id == selectedMachine">
                        <p v-if="!house.noMachines" class="subtitle is-3">{{ m.name }}</p>
                        Click to book a time<br>
                        
                        <!-- iterate time slots -->
                        <button v-for="s in slots" :key="s" :value="s"
                            class="button"                         
                            v-bind:class="[ bookings.find(b => b.date == selectedDay && b.startTime == s && b.machineId == m.id && user.id == b.userId)
                                              ? 'button is-warning'
                                              : (bookings.find(b => b.date == selectedDay && b.startTime == s && b.machineId == m.id) 
                                                  ? 'button is-danger'
                                                  : 'button is-primary')]"
                            :disabled="bookings.find(b => b.date == selectedDay && b.startTime == s && b.machineId == m.id)"
                            v-on:click.prevent="saveBooking(m.id, parseInt(selectedDay), s)"
                            > 
                            <!-- :disabled="bookings.find(b => b.date == selectedDay && b.startTime == s && b.machineId == m.id)" 
                                 v-on:click.prevent="saveBooking(user.id, parseInt(selectedDay), s, m.id)"
                            -->
                            <i class="far fa-clock"></i> &nbsp; {{ String(s).padStart(2, '0') }}:00 - {{ String(parseInt(s) + parseInt(house.slotLength)).padStart(2, '0') }}:00 
                            <!--
                            <span v-if="bookings.find(b => b.date == selectedDay && b.startTime == s && b.machineId == m.id)">
                              &nbsp;&nbsp;<span style="float:right">{{ bookings.find(b => b.date == selectedDay && b.startTime == s && b.machineId == m.id).aptNumber }}
                              
                              </span>
                            </span> --> <!--&& (b.aptNumber || b.name">Apt:{{ b.aptNumber }} N:{{ b.name }}-->
                            <br>
                             <!--                          
                            <span v-if="house.visibleUserInfo == 1"> apt {{ b.aptNumber }}</span>
                            <span v-if="house.visibleUserInfo == 2"> N: {{ b.name }}</span> -->
                        </button> 
                    </span> <!-- end machines -->                    
                  </div>

                </section>
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
  name: 'booking',
  data () {
    return { 
      showInfoPanel: false,
      showBookingPanel: false,
      successMsg: '',
      errorMsg: '',
      machines: [],
      slots: [],
      calendarDates: [],
      selectedDay: null,
      selectedMachine: "-1",
      weekdays: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat','Today','Tomorrow','The day after tomorrow'],
      totBookings: 0,
      currentHour: null
    }
  },
  methods: {
    createSlotArray: function (start,end,increase) {            
            console.log('--slotStart ', start);
            console.log('--slotEnd ', end);
            console.log('--house.slotLength ', increase);
        // creates array of days bookable time slots (= start times)
        let slots = [];
        let counter = null;
        for(counter = start; counter < end; counter+=increase) { slots.push(counter); }
        console.log('slots ', slots);
        this.slots = slots;
    },
    getMachines: function () {      
        let machineNames = this.house.machineNames;
        let newMachines = [];
        if(machineNames.indexOf(";") == -1) {                
              // one item
              newMachines.push({ 'name': machineNames, 'id': "0" });
          } else {
              // multiple items
              let mArr = machineNames.split(";");
              let counter = 0;
              for( let i = 0; i < mArr.length; i++){ 
                  if(mArr[i] != '') {
                      newMachines.push({ 'name': mArr[i], 'id': counter });
                      counter++;
                  }
              }
          }
          this.machines = newMachines;
    },
    getCalendarDates: function (getTodaysValueOnly=false, getDisplayDate=false) {
      // returns dates of next 1-8 weeks
      let tempCalendarDates= Array();
      let d;
      for (d = 0; d < this.house.bookingTimeSpan; d++) { 
        let day = new Date();
        day.setDate(day.getDate() + d);
        let dd = String(day.getDate()).padStart(2, '0');
        let mm = String(day.getMonth() + 1).padStart(2, '0');
        let yy = String(day.getFullYear());
        yy = yy.substr(0, 2);
        if(getTodaysValueOnly) { return yy + mm + dd; }
        let dayNum = day.getDay();   
        while(dayNum>6) { dayNum-=7; } 
        let displayDate = day.toLocaleDateString();  
        if(d == 0) { this.selectedDay = yy + mm + dd; dayNum = 7; }
        tempCalendarDates.push({ id: yy + mm + dd, dayNum: dayNum, disp: displayDate });
      }        
      this.calendarDates = tempCalendarDates;
    },
    getSingleDaysInfo: function (dbDate, dateOnly=false) {
      // returns single date as array [day number, date in local format]
      dbDate = String(dbDate);
      let day = new Date();
      day.setFullYear(dbDate.substr(0,4), parseInt(dbDate.substr(4,2))-1, dbDate.substr(6,2));
      if(dateOnly) return this.getDayName(day.getDay()) + ' ' + day.toLocaleDateString();
      return [ day.getDay(), day.toLocaleDateString() ];
    },
    getDayName : function (dayNum, index) {
      if(index >= 0 && index <= 2) return this.weekdays[index+7];
      return this.weekdays[dayNum];
    },
    getBookerInfo: function(userId) { 
      return bookings.find(b => b.userId == userId).aptNumber;
      /*
      let bookings = this.bookings;
      let isFound = bookings.reduce(function (n, b) {
        return (b.userId == userId).name;
      }, 0); */
    },
    saveBooking: function(machineId, date, startTime) {
      if(parseInt(this.totBookings)<parseInt(this.house.maxBookingsPerUser)) {
        this.addBooking({
          "userId": this.user.id,
          "houseId": this.house.id,
          "machineId": machineId,
          "date": date,
          "startTime": startTime,
          "name": this.user.name,
          "aptNumber": this.user.aptNumber
        });        
      } else {
        this.errorMsg = 'Note: You can have a max ' + this.house.maxBookingsPerUser + ' bookings';
      }
    },
    deleteBooking: function (bookingId) {
      if(confirm ('Are you sure you want to delete?')) {
        this.removeBooking({ "id": bookingId });
        return;
      } 
    },
    ...mapActions(["getBookings", "addBooking", "removeBooking"])
  }, // end methods 
  watch: {
    // execution continues here
    house: function() {  
    
    }
  }, 
  filters: { 
    // add a leading zero to time < 10
    leftPad: function (value) {     
      if (!value) return ''     
      value = value.toString()  
      while (value.length < (2 || 2)) {value = "0" + value;}   
      return value;
    } 
  },
  async mounted() {
    var date = new Date();
    await this.createSlotArray(parseInt(this.house.slotStart), parseInt(this.house.slotEnd), parseInt(this.house.slotLength));
    if(this.house.noMachines == 0) { this.house.noMachines = false; }
    await this.getMachines();
    await this.getCalendarDates(); 
    await this.getBookings([this.house.id]);
  },          
  created() {
    /*
    var date = new Date();
    this.currentHour = date.getHours();
    this.createSlotArray(parseInt(this.house.slotStart), parseInt(this.house.slotEnd), parseInt(this.house.slotLength));
    if(this.house.noMachines == 0) { this.house.noMachines = false; }
    this.getMachines();
    this.getCalendarDates(); 
    //this.createSlotArray(parseInt(this.house.slotStart), parseInt(this.house.slotEnd), parseInt(this.house.slotLength));
    this.getBookings([this.house.id]);
    */
  },
  computed: mapGetters(["bookings", "user", "house"])
};
</script>

<style scoped>
</style>