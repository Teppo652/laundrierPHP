const state = {  
    code: [],
    house: null,
    user: [],
    bookings: [],
    booking: []
  };
  
  const getters = {
    code: state => state.code,
    house: state => state.house,
    user: state => state.user,
    bookings: state => state.bookings,
    booking: state => state.booking
  };
  
  const actions = {
    async loginUser({ commit }, data) {
      let postData = null;
      console.log('store login user: postData:', data);
      if(data) { postData  = JSON.stringify(data); }
      //let data = [];  
      const url = 'https://stuffonaut.com/laundrier/loginUser.php';  
      fetch(url, {
           method: 'POST',
           headers: new Headers({
               'Content-Type': 'application/json',
               'Accept': 'application/json'
             }),
           body: postData
         }).then(res => {
           if (res.ok) {
            return res.json();
           } else {
             console.log('store login user:', res);
           }  
         }).then(data => {
          console.log('store login returned:', data);
           if(data[0] != null) {
             console.log('store login user: user found');
            commit('setUser', data[0]);
           } else { 
            console.log('store login user: user not found');
            commit('setUser', []);             
           }           
         })
         .catch(error => { 
           console.error(error);
         });
    },
    async saveHouse({ commit }, data) {       
      let newHouseId = null; 
      let postData = null;
      if(data) { postData  = JSON.stringify(data); }
      const url = 'https://stuffonaut.com/laundrier/saveHouse.php';
      fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }),
        body: postData
      }).then(res => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(res);
        }
      }).then(newHouse => {
        data.id = newHouse.id;
        data.registrationCode = newHouse.registrationCode;
        commit('setHouse', data);
      })
      .catch(error => { 
        console.error(error);
      }); 
    },
    async saveUser({ commit }, data) {       
      let newUserId = null; 
      let postData = null;
      if(data) { postData  = JSON.stringify(data); }
      const url = 'https://stuffonaut.com/laundrier/saveUser.php';
      fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }),
        body: postData
      }).then(res => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(res);
        }
      }).then(newUser => {
        // if email exists already        
          // not in use yet
        if(newUser.id == 'userExists') {
          console.log('store: User with that email exists already');
        } else {
          // saved user in DB                   
          console.log('store: User created, id:', newUser.id);
        }
        data.id = newUser.id;
        commit('setUser', data);
      })
      .catch(error => { 
        console.error(error);
      }); 
    },
    async getCode({ commit }, code ) { 
      commit('setCode', code);
    },
    async getHouseData({ commit }, arr) {      
      let postData = null;
      //if(data) { postData  = JSON.stringify(data); }
      let data = [];
      let url = 'https://stuffonaut.com/laundrier/getHouseData.php?';
      if(arr[1] == '-1') { 
        url += 'h=' + arr[0]; 
      } else { 
        url += 'r=' + arr[1]; 
      }
      console.log('getHouseData url:', url);
      fetch(url, {
           method: 'GET',
           headers: new Headers({
               'Content-Type': 'application/json',
               'Accept': 'application/json'
             }),
             body: postData
         }).then(res => {
           if (res.ok) {
            return res.json();
           } else {
             console.log(res);
           }  
         }).then(data => {
          if(data.length == 0) { data = []; }
          commit('setHouse', data[0]);
         })
         .catch(error => { 
           console.error(error);
         });
    },    
    async getBookings({ commit }, arr) {
      let data = [];
      const url = 'https://stuffonaut.com/laundrier/getBookings.php?h=' + arr[0];  
      fetch(url, {
           method: 'GET',
           headers: new Headers({
               'Content-Type': 'application/json',
               'Accept': 'application/json'
             })          
         }).then(res => {
           if (res.ok) {
            return res.json();
           } else {
             console.log(res);
           }  
         }).then(data => {
           if(data.length == 0) { data = []; }
           commit('setBookings', data);            
         })
         .catch(error => { 
           console.error(error);
         });
    },
    async removeBooking({ commit }, data) {  
      let newHouseId = null;
      let postData = null;
      if(data) { postData  = JSON.stringify(data); }
      const url = 'https://stuffonaut.com/laundrier/deleteBooking.php';
      fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }),
        body: postData
      }).then(res => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(res);
        }
      }).then(deleted => {
        if(deleted == 1) {
          commit('removeBooking', data.id);
        }
      })
      .catch(error => { 
        console.error(error);
      }); 
    },
    async addBooking({ commit }, data) {       
      let newHouseId = null; 
      let postData = null;
      if(data) { postData  = JSON.stringify(data); }
      const url = 'https://stuffonaut.com/laundrier/saveBooking.php';
      fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }),
        body: postData
      }).then(res => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(res);
        }
      }).then(newBooking => {
        if(newBooking != 0) { // checks if booking already exists
          data.id = newBooking.id;
          commit('addBooking', data);
        }
      })
      .catch(error => { 
        console.error(error);
      }); 
    }
  };

  const mutations = {    
    setUser: (state, user) => (state.user = user),
    setCode: (state, code) => (state.code = code), 
    setHouse: (state, house) => (state.house = house),
    //setBookings: (state, bookings) => (state.bookings = bookings),
    setBookings: function(state, bookings) {
      // add sorting field
      bookings.forEach(function(data, index) {
        data.sorting = data.date + 'M' + data.machineId + 'T' + data.startTime;
      });
      // sort by date, machineId and startTime
      bookings = bookings.sort(function(a,b) {return (a.sorting > b.sorting) ? 1 : ((b.sorting > a.sorting) ? -1 : 0);} );
      state.bookings = bookings;
    },
    setBooking: (state, booking) => (state.booking = booking),
    //addBooking: (state, data) => state.bookings.push(data),
    addBooking: function(state, data) { 
      data.sorting = data.date + 'M' + data.machineId + 'T' + data.startTime;
      state.bookings.push(data);
      // sort by date, machineId and startTime
      state.bookings = state.bookings.sort(function(a,b) {return (a.sorting > b.sorting) ? 1 : ((b.sorting > a.sorting) ? -1 : 0);} );      
    },
    removeBooking: (state, id) => state.bookings = state.bookings.filter(booking => booking.id !== id)
  };
  
  export default {
    state,
    getters,
    actions,
    mutations
  };