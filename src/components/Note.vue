<template>
  <body>
    <div id="app" class="d-flex align-items-center justify-content-center">
      <v-app>
        <v-container>
          <v-row aling="center">
            <v-col>
              <div class="mb-4">Select Note Type:</div>
              <div><v-select :items="items"></v-select></div>
            </v-col>
          </v-row>
        </v-container>
        <v-container>
          <v-row aling="center" v-if="note">
            <v-col>
              <h1>{{ note.properties.text }}</h1>
            </v-col>
          </v-row>
        </v-container>
      </v-app>
    </div>
  </body>
</template>

<script>
export default {
  name: "Note",
  data() {
    return {
      items: ["Bullet List", "Check List", "Title", "Paragraph"],
    };
  },
  pouch: {
    // The simplest usage. queries all documents from the "todos" pouch database and assigns them to the "todos" vue property.
    note() {
      return {
        database: this.$store.state.user.db,
        selector: { _id: this.$route.params.note_id },
        first: true,
      };
    },
  },
  mounted() {
    console.log(this.$route.params.note_id);
    // this.note_id = this.$route.params.note_id;
    // console.log(this.note_id);
    // this.$pouch
    //   .get(this.note_id)
    //   .then(function (doc) {
    //     this.note = doc;
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   });
  },
};
</script>
