<template>
  <div>
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="3"><span></span></v-col>
        <v-col class="ml-16" cols="5">
          <v-card color="indigo darken-5" dark class="rounded-xl">
            <v-container fluid>
              <v-row align="center" justify="center">
                <v-col cols="9">
                  <v-text-field
                    class="ml-4"
                    v-model="note_title"
                    label="Note title"
                  ></v-text-field>
                </v-col>
                <v-col class="justify-center">
                  <div class="text-center">
                    <v-btn outlined color="white" @click="createNote()">
                      New note
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-col align="end">
          <v-btn outlined @click="logOut()" color="red"> Logout </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center" v-if="notes">
        <v-col cols="6" class="pl-0">
          <span v-if="notes.length === 0">
            <v-divider></v-divider>
            <h1 class="indigo--text darken-5 text-center">
              You haven't created a note yet. To create one insert a title and
              click on the new note button.
            </h1>
          </span>

          <v-card
            color="indigo darken-5"
            dark
            class="rounded-xl"
            v-if="notes.length !== 0"
          >
            <v-dialog v-model="dialog" width="500" v-if="note_selected">
              <v-sheet
                class="px-7 pt-7 pb-4 mx-auto text-center d-inline-block"
                color="blue-grey darken-3"
                dark
              >
                <div class="grey--text text--lighten-1 text-body-2 mb-4">
                  Are you sure you want to delete:
                  {{ note_selected.text }}
                </div>

                <v-btn
                  :disabled="loading"
                  class="ma-1"
                  color="grey"
                  plain
                  @click.stop="closingWarningDialog()"
                >
                  Cancel
                </v-btn>

                <v-btn
                  :loading="loading"
                  class="ma-1"
                  color="error"
                  plain
                  @click="deleteNote()"
                >
                  Delete
                </v-btn>
              </v-sheet>
            </v-dialog>
            <v-container fluid>
              <v-row v-for="note in notes" :key="note.text">
                <v-col class="pa-2">
                  <v-card
                    color="indigo lighten-1"
                    elevation="4"
                    class="rounded-xl"
                  >
                    <v-container>
                      <v-row justify="center" align="center">
                        <v-col cols="1">
                          <v-btn
                            color="red darken-4"
                            dark
                            outlined
                            small
                            fab
                            @click.stop="openWarningDialog(note)"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="10">
                          <h1
                            class="ml-3 align-center"
                            style="
                              font-family: 'Arial Rounded MT Bold', sans-serif;
                            "
                          >
                            {{ note.text }}
                          </h1>
                        </v-col>

                        <v-col cols="1">
                          <router-link
                            style="text-decoration: none"
                            :to="'/note/' + note._id"
                            ><v-btn color="white" dark outlined small fab>
                              <v-icon> mdi-chevron-right </v-icon>
                            </v-btn>
                          </router-link>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
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
export default {
  name: "Home",
  data() {
    return {
      note_title: null,
      dialog: false,
      note_selected: null,
      loading: false,
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
    logOut() {
      this.$pouch
        .disconnect(this.$store.state.user.db.url)
        .then(console.log)
        .catch(console.log);
      this.$store.commit("disconnect");
      this.$router.push("/");
    },

    createNote() {
      let note = {
        _id: new Date().toISOString(),
        type: "page",
        text: this.note_title,
        properties: {
          content: [],
        },
        parent: null,
      };
      this.$pouch
        .put(note, {}, this.$store.state.user.db.url)
        .then((doc) => {
          console.log(doc);
          this.$router.push({ name: "Note", params: { note_id: doc.id } });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteNote() {
      console.log(this.note_id);
      this.loading = true;
      this.$pouch
        .remove(this.note_selected, {}, this.$store.state.user.db.url)
        .then(() => {
          this.dialog = false;
          this.note_selected = false;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.dialog = false;
          this.loading = false;
        });
    },
    openWarningDialog(note) {
      this.note_selected = note;
      this.dialog = true;
    },
    closingWarningDialog() {
      this.dialog = false;
      this.note_selected = null;
    },
  },
};
</script>
