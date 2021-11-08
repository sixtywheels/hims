<template>
    <div id="login">
      <div id="trytry">
        <h1>Hospital Inventory Management System (HIMS)</h1>
        <h2>Empower People to Improve Other's Lives</h2>
        <!-- <h3>Account Type</h3>
        <br> -->
        <!-- <div style="text-align: center">
            <ul>
                <li>
                    <v-btn><router-link to="/userlogin" exact>Hospital Staff</router-link></v-btn>
                </li>
                <li>
                    <v-btn><router-link to="/poweruserlogin" exact>Logistics & Procurement Staff</router-link></v-btn>
                </li>
            </ul>
        </div> -->

        <div id="vcard">  
            <v-card>
                <div id="content">
                    <v-card-title class="justify-center">Account Type</v-card-title>
                        <v-btn color="#B3E5FC" class="mr-4" v-on:click="$router.push({ path:'/userlogin' })">Hospital Staff</v-btn>
                        <v-btn color="#B3E5FC" v-on:click="$router.push({ path:'/poweruserlogin' })">Logistics Staff</v-btn>
                </div>
            </v-card>
        </div>

      </div>
    </div>
</template>


<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;800;900&display=swap'); */
#login {
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
h3 {
  text-align: center;
  margin: 20px;
  font-size: 34px;
  font-family: Nunito;
  font-weight: bolder;
  margin-top:50px;
  color: rgb(16, 240, 210);
}
ul {
  list-style-type: none;
  margin-top: -20px;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  font-family: Nunito;
  font-weight: bold;
  color: rgb(0, 114, 180);
  text-decoration: none;
}
#email {
  margin-top:50px;
}
#emailh2 {
  font-size:16px;
  color:whitesmoke;
  font-weight:bolder;
  outline-style: 2px solid black;
}

#trytry {
  /* background: rgba(245, 247, 245, 0.3); Green background with 30% opacity */
  margin: auto;
  width: 60%;
  /* margin-top: 50px; */
      /* display: flex; */
    /* align-items: center;
    justify-content: center; */
  /* padding: 10%; */
}

#vcard {
    display: flex;
    align-items: center;
    justify-content: center;
}

#content {
    /* padding-left:18px; */
    padding-bottom: 15px;
    padding-left: 10px;
    padding-right: 10px;
    /* text-align: center;    */
}

</style>