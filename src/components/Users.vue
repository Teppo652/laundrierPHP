<template>
    <div><!-- =============================== this component is work in progress and not used yet===================================== -->
    <section class="section">
      <div class="container has-text-centered">

          <h2 class="title">Users</h2>
          <div class="columns is-centered">
            <div class="column is-5 is-5-desktop">
              <form>
                <!-- list all users of this laundry room (=house) -->
                <div class="tags wide">
                  <span v-for="u in users" :key="u.id"
                          class="tag is-warning is-medium is-fullwidth bookingTag">
                          APT: {{ u.aptNumber }} {{ u.lastName }} &nbsp; {{ totalBookings }} 
                  <button v-on:click.prevent="" class="delete is-small"></button>                  
                  </span>
                </div>
                <p v-if="!users" class="has-text-white-bis">There are 0 users.</p>                
              </form>
            </div>
          </div>

      </div>
    </section>



    </div>
</template>

<script>
export default {
  name: 'users',
  data () {
    return {
      users: [],
      usersHouseId: ''
    }
  },
  methods: {
    getUsers: function () {
      db.collection('users')
            .get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    //if(this.usersHouseId == oc.data().usersHouseId) { 
                      this.users.push({ 
                        'id': doc.id,
                        'aptNumber': doc.data().aptNumber,
                        'lastName': doc.data().lastName,
                        'totalBookings': doc.data().totalBookings
                      });
                    //}
                });
            })
            .then(docRef => {
              console.error('Success reading users')
            })
            .catch(error => {
              console.error('Error in reading users: ', error)
            });
    }
  },
  created() {
    var promise = new Promise(function(resolve, reject) { resolve(); });
    var self = this;
    promise.then(function(data) { self.getUsers(); });    
  }
}
</script>

<style scoped>


</style>