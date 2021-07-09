<template>
  <div>
    <v-container>
      <v-row class="title" aling="center" justify="center">
        <v-col>
          <h1 class="text-center ma-5 indigo--text">Login to your database</h1>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="3">
          <v-card elevation="8" color="indigo darken-5" dark class="rounded-xl mt-12">
            <v-container fluid>
              <v-row>
                <v-col>
                  <v-text-field
                    class="mt-4"
                    label="Username"
                    v-model="username"
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    class="mt-4"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required]"
                    :error-messages="invalidCredential"
                    :type="show1 ? 'text' : 'password'"
                    v-model="password"
                    label="Password"
                    @keyup.enter="connectToDatabase()"
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col>
                  <div class="text-center">
                    <v-btn
                      outlined
                      color="white"
                      large
                      @click="connectToDatabase()"
                    >
                      Login
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-container>
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
      show1: false,
      unauthorized: false,
      rules: {
        required: (value) => !!value || "Required.",
      },
    };
  },
  mounted() {
    console.log("MOUNTED");
    this.$pouch
      .getSession()
      .then((data) => {
        console.log(data);
        if (data.status === 0) {
          console.log("most likely offline");
          return;
        }

        if (!data.user || !data.hasAccess) {
          return;
        }
        this.$router.push("/home");
      })
      .catch(console.log);
  },
  computed: {
    invalidCredential() {
        if (this.unauthorized)
            return "Invalid credentials.";
        else
            return null;
    }
  },
  methods: {
    connectToDatabase() {
      let database = "userdb-" + String2Hex(this.username);
      let dbURL = "http://localhost:5984/" + database;
      console.log(database);
      this.$pouch
        .connect(this.username, this.password, dbURL)
        .then((res) => {
          let isUnauthorized = res.error === "unauthorized",
            isOffline = res.status === 0;
          if (isOffline) {
            return;
          }
          if (isUnauthorized) {
            this.unauthorized = true;
            return;
          }
          this.$store.commit("insert", {
            name: this.username,
            db: { name: database, url: dbURL },
          });
          this.$router.push("/home");
        })
        .catch((error) => {
          console.log("ERROR");
          console.error(error);
        });
    },
  },
};
</script>
