<template>
    <div id="login">
        <h1>Hospital Inventory Management System (HIMS)</h1>
        <h2>Empower People to<br>Improve Other's Lives</h2>
        <h3>Account Type</h3>
        <div style="text-align: center">
            <ul>
                <li>
                    <v-btn><router-link to="/userlogin" exact>Hospital Staff</router-link></v-btn>
                </li>
                <li>
                    <v-btn><router-link to="/poweruserlogin" exact>Logistics & Procurement Staff</router-link></v-btn>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;800;900&display=swap'); */
#login {
  position: relative;
  background-size: cover;
  background-image: url("https://www.bain.com/globalassets/capabilities/hero-images---still/final_consultingservicesheaders_v20_operations_1440x810.png");
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
#contact {
  margin-top:10px;
}
</style>