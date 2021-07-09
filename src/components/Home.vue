<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="9">
          <v-text-field
            class="mt-4"
            v-model="note_title"
            label="Note title"
          ></v-text-field>
        </v-col>
        <v-col class="justify-center">
          <v-btn @click="createNote()"> Nueva nota </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row v-for="note in notes" :key="note.properties.text">
        <v-col>
          <router-link :to="'/note/' + note._id">
            <v-card>
              <h1>{{ note.properties.text }}</h1>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      note_title: null,
    };
  },
  pouch: {
    // The simplest usage. queries all documents from the "todos" pouch database and assigns them to the "todos" vue property.
    notes() {
      return {
        database: this.$store.state.user.db.name, // you can pass a database string or a pouchdb instance
        selector: {},
      };
    },
  },
  created() {
    // Send all documents to the remote database, and stream changes in real-time
    this.$pouch.sync(
      this.$store.state.user.db.name,
      this.$store.state.user.db.url
    );
  },
  methods: {
    createNote() {
      let note = {
        _id: new Date().toISOString(),
        type: "page",
        properties: {
          text: this.note_title,
          content: [],
        },
        parent: null,
      };
      this.$pouch
        .put(note, {}, "http://localhost:5984/" + this.$store.state.user.db)
        .then((doc) => {
          console.log(doc);
          this.$router.push({ name: "Note", params: { note_id: doc.id } });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
