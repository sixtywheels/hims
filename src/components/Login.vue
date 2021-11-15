<template>
    <div id="login">
      <div id="trytry">
        <h1>Hospital Inventory Management System (HIMS)</h1>
        <h2>Empower People to Improve Other's Lives</h2>

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

#trytry {
  margin: auto;
  width: 60%;
}

#vcard {
    display: flex;
    align-items: center;
    justify-content: center;
}

#content {
    padding-bottom: 15px;
    padding-left: 10px;
    padding-right: 10px;
}

</style>