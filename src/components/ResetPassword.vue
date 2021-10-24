<template>
  <div id="ResetPassword">
    <h1>Hospital Inventory Management System (HIMS)</h1>
    <router-link to="/" exact><v-icon dark right>mdi-home</v-icon></router-link>
    <h2>Reset Password Page</h2>
    <br /><br />
    <div id="vcard">
      <v-card id="test" width="700">
        <div id="content">
          <v-card-title>Reset your password!</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field label="Email" v-model="email"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="#EF9A9A" class="mr-4" @click="reset">Reset</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>

import firebase from 'firebase/compat/app';

export default {
  data: function() {
    return {
      email: "",
    };
  },
  methods: {
    reset: async function() {
      var auth = firebase.auth();

      if (this.email != "") {
        //The email takes awhile
        await auth
          .sendPasswordResetEmail(this.email)
          .then(function() {
            // Email sent.
            console.log("Sent Successfully")
            alert("Your password has been reset. Check your email for instructions.")
          })
          .catch(function(error) {
            alert(error);
          });
        
        this.$router.push({path: "/"});
      } else {
        alert("Please fill in your email");
        console.log(this.$router)
      }
    },
  },
};

</script>


