<template>
  <body>
    <div id="app">
      <v-app>
        <div class="text-center">
          <h1 class="ml-2 text-center">
            {{ note.text }}
          </h1>
          <v-divider></v-divider>
        </div>
        <!-- NOTA PADRE -->
        <note-component :id="note._id"></note-component>
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
    console.log(this.$route.params.note_id);
  },
  methods: {
    showParams(type) {
      if (type === "Bullet List") {
        this.bullet_icon = true;
      } else if (type === "Check List") {
        this.check_completed = true;
      }
    },
  },
};
</script>
