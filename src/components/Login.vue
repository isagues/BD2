<template>
  <div class="d-flex align-items-center justify-content-center">
    <v-container>
      <v-row class="title" aling="center" justify="center">Login</v-row>
      <v-row aling="center" justify="center">
        <v-col
          cols="12"
          lg="6"
          md="6"
          class="fill-height d-flex flex-column justify-center align-center"
        >
          <v-btn><router-link to="/home">home</router-link></v-btn>
          <v-card elevation="2" shaped tile>
            <div class="ml-4 mr-4">
              <v-text-field
                class="mt-4"
                label="Username"
                v-model="username"
                hide-details="auto"
              ></v-text-field>
              <v-text-field
                class="mt-4"
                v-model="password"
                label="Password"
              ></v-text-field>
              <v-btn @click="connectToDatabase()"> Login </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
function String2Hex(tmp) {
  var str = "";
  for (var i = 0; i < tmp.length; i++) {
    str += tmp[i].charCodeAt(0).toString(16);
  }
  return str;
}

export default {
  name: "Login",
  data() {
    return {
      username: null,
      password: null,
    };
  },
  methods: {
    connectToDatabase() {
      let database = "userdb-" + String2Hex(this.username);
      console.log(database);
      this.$pouch
        .connect(this.username, this.password, database)
        .then((res) => {
          let isUnauthorized = res.error === "unauthorized",
            isOffline = res.status === 0;
          if (isOffline) {
            return;
          }
          if (isUnauthorized) {
            return;
          }
          this.$store.commit("insert", { name: this.username, db: database});
          this.$router.push("/home");
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
