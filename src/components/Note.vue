<template>
  <body>
    <div id="app">
      <v-app>
          <div v-if="note">
            <div class="text-center mb-2 mt-2">
              <v-btn @click="ret(note)">
                Return
              </v-btn>
              <h1 class="ml-2 text-center">
                {{ note.text }}
              </h1>
              <v-row class="justify-center align-center">
                <v-col cols="9">
                  <v-divider class="mb-4 mt-3"></v-divider>
                </v-col>
              </v-row>
            </div>
            <!-- NOTA PADRE -->
            <note-component :id="note._id"></note-component>
        </div>
      </v-app>
    </div>
  </body>
</template>

<script>
import NoteComponent from "./NoteComponent";

export default {
  name: "Note",
  components: {
    NoteComponent,
  },
  data() {
    return {
      check_completed: false,
      bullet_icon: false,
    };
  },
  pouch: {
    // The simplest usage. queries all documents from the "todos" pouch database and assigns them to the "todos" vue property.
    note() {
      return {
        database: this.$store.state.user.db.name,
        selector: { _id: this.$route.params.note_id },
        first: true,
      };
    },
  },
  mounted() {
          // Send all documents to the remote database, and stream changes in real-time
    console.log("SYNC");
    this.$pouch.sync(
      this.$store.state.user.db.name,
      this.$store.state.user.db.url
    );
  },
  updated() {
        console.log(this.$route.params.note_id);
        this.$pouch.get(this.$route.params.note_id)
        .then((doc) => {
          if (doc.type !== 'page') {
            this.ret(doc);
          }
        })
        .catch((err) => {console.log(err);});
  },
  // beforeRouteEnter(to) {
    
  // },
  methods: {
    showParams(type) {
      if (type === "Bullet List") {
        this.bullet_icon = true;
      } else if (type === "Check List") {
        this.check_completed = true;
      }
    },
    ret(note) {
      if (!note.parent) {
        this.$router.push("/home");
      } else {
        this.$router.push("/note/" + note.parent);
      }

    }
  },
};
</script>
