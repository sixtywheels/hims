<template>
  <div id="ResetPassword">
    <div id="div2">
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

<style scoped>
#ResetPassword {
  position: relative;
  background-size: cover;
  background-image: url("https://upload.wikimedia.org/wikipedia/commons/c/c0/KRW_Facade2_final.jpg");
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
}

h1 {
  text-align: center;
  padding-left: 20px;
  color: rgb(255, 255, 255);
  font-family: Nunito;
  font-weight: bolder;
  font-size: 40px;
}
h2 {
  text-align: center;
  margin: 20px;
  font-size: 34px;
  font-family: Nunito;
  font-weight: bolder;
  margin-top:75px;
  color: rgb(255, 255, 255);
}

#div2 {
  margin: auto;
  width: 60%;
}

#vcard {
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>

