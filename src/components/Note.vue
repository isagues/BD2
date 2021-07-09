<template>
  <body>
    <div id="app" class="d-flex align-items-center justify-content-center">
      <v-app>
        <div class="text-center">
          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn fab color="indigo darken-5" v-bind="attrs" v-on="on">
                <v-icon color="white">mdi-pencil</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                Edit Note
              </v-card-title>
              <v-container>
                <v-row aling="center">
                  <v-col>
                    <div class="mb-4">Select Note Type:</div>
                    <div>
                      <v-select
                        :items="items"
                        v-model="type"
                        @change="showParams(type)"
                      ></v-select>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-text-field
                    class="mt-4"
                    label="Note"
                    v-model="new_text"
                    hide-details="auto"
                  ></v-text-field>
                </v-row>
              </v-container>
              <v-card-text> </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="putNote(type)">
                  DONE
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
      items: ["Bullet List", "Check List", "Title", "Paragraph"],
      dialog: false,
      check_completed: false,
      bullet_icon: false,
      new_text: null,
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
  methods: {
    showParams(type) {
      if (type === "Bullet List") {
        this.bullet_icon = true;
      } else if (type === "Check List") {
        this.check_completed = true;
      }
    },
    putNote(type) {
      let new_id;
      if (type == "Bullet List") {
        new_id = this.putBullet();
      } else if (type == "Check List") {
        new_id = this.putCheck();
      } else if (type == "Paragraph") {
        new_id = this.putParagraph();
      } else if (type == "Title") {
        new_id = this.putTitle();
      }
      this.updateParent(new_id);
    },

    putBullet() {
      let note = {
        _id: new Date().toISOString(),
        type: "bullet",
        properties: {
          text: this.new_text,
          icon: "circle",
          content: [],
        },
        parent: this.$route.params.note_id,
      };
      this.$pouch
        .put(note, {}, this.$store.state.user.db.name)
        .then((doc) => {
          console.log(doc);
          this.dialog = false;
        })
        .catch((err) => {
          console.log(err);
        });
      return note._id;
    },

    putCheck() {
      let note = {
        _id: new Date().toISOString(),
        type: "check",
        properties: {
          text: this.new_text,
          completed: false,
          content: [],
        },
        parent: this.$route.params.note_id,
      };
      this.$pouch
        .put(note, {}, this.$store.state.user.db.name)
        .then((doc) => {
          console.log(doc);
          this.dialog = false;
        })
        .catch((err) => {
          console.log(err);
        });
      return note._id;
    },

    putTitle() {
      let note = {
        _id: new Date().toISOString(),
        type: "title",
        properties: {
          text: this.new_text,
          content: [],
        },
        parent: this.$route.params.note_id,
      };
      this.$pouch
        .put(note, {}, this.$store.state.user.db.name)
        .then((doc) => {
          console.log(doc);
          this.dialog = false;
        })
        .catch((err) => {
          console.log(err);
        });
      return note._id;
    },

    putParagraph() {
      let note = {
        _id: new Date().toISOString(),
        type: "paragraph",
        properties: {
          text: this.new_text,
          content: [],
        },
        parent: this.$route.params.note_id,
      };
      this.$pouch
        .put(note, {}, this.$store.state.user.db.name)
        .then((doc) => {
          console.log(doc);
          this.dialog = false;
        })
        .catch((err) => {
          console.log(err);
        });
      return note._id;
    },

    updateParent(child_id) {
      let new_content = this.note.properties.content;
      new_content.push(child_id);

      let updated_note = {
        _id: this.$route.params.note_id,
        _rev: this.note._rev,
        type: this.note.type,
        properties: {
          text: this.note.properties.text,
          content: new_content,
        },
        parent: this.note.parent,
      };
      console.log(updated_note);
      this.$pouch
        .put(updated_note, {}, this.$store.state.user.db.name)
        .then((doc) => {
          console.log("UPDATED PARENT");
          console.log(this.note);
          console.log(doc);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
