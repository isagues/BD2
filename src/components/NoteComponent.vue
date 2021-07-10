<template>
  <v-container class="parent" v-if="NoteComponent">
    <v-row
      aling="center"
      justify="center"
      v-if="NoteComponent._id !== $route.params.note_id"
    >
      <v-col class="ma-0 pa-0">
        <h3 class="ml-2 text-break" v-if="NoteComponent.type === 'page'">
          <router-link :to="'/note/' + NoteComponent._id">
            {{ NoteComponent.text }}
          </router-link>
        </h3>
        <h3 class="ml-2 text-break" v-if="NoteComponent.type === 'title'">
          {{ NoteComponent.text }}
        </h3>
        <div
          class="text-break"
          v-if="NoteComponent.type !== 'page' && NoteComponent.type !== 'title'"
        >
          <span class="ml-2" v-if="NoteComponent.type === 'bullet'">
            <v-icon x-small>mdi-checkbox-blank-circle</v-icon></span
          >
          <span class="ml-0" v-if="NoteComponent.type === 'check'">
            <v-btn icon @click="completeCheck()">
              <v-icon v-if="!NoteComponent.properties.completed" medium
                >mdi-checkbox-blank-outline</v-icon
              >
              <v-icon
                color="blue"
                v-if="NoteComponent.properties.completed"
                medium
                >mdi-checkbox-marked</v-icon
              >
            </v-btn></span
          >
          {{ NoteComponent.text }}
        </div>
      </v-col>

      <v-col align="end" cols="auto" class="ma-0 pa-0">
        <v-btn icon color="indigo" @click="edit_dialog = true">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
        <v-dialog v-model="edit_dialog" width="500">
          <v-sheet
            class="px-7 pt-7 pb-4 mx-auto text-center d-inline-block"
            color="blue-grey darken-3"
            dark
          >
            <v-container fluid>
              <v-row>
                <v-col>
                  <v-text-field
                    class="ml-4"
                    v-model="note_edit_text"
                    label="New Content"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="2">
                  <v-btn
                    :disabled="loading"
                    class="ma-1"
                    color="grey"
                    plain
                    @click.stop="edit_dialog = false"
                  >
                    Cancel
                  </v-btn>
                </v-col>
                <v-col cols="2">
                  <v-btn
                    :loading="loading"
                    class="ma-1"
                    color="indigo lighten-3"
                    plain
                    @click="editComponent()"
                  >
                    Edit
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </v-dialog>
        <v-btn icon color="indigo" @click="add_dialog = true" :disabled="disabled">
          <v-icon v-if="NoteComponent.type !== 'page'">mdi-plus</v-icon>
        </v-btn>
        <v-btn icon color="red" @click="delete_dialog = true">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-dialog v-model="delete_dialog" width="500">
          <v-sheet
            class="px-7 pt-7 pb-4 mx-auto text-center d-inline-block"
            color="blue-grey darken-3"
            dark
          >
            <div class="grey--text text--lighten-1 text-body-2 mb-4">
              Are you sure you want to delete:
              {{ NoteComponent.text }}
            </div>

            <v-btn
              :disabled="loading"
              class="ma-1"
              color="grey"
              plain
              @click.stop="delete_dialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
              :loading="loading"
              class="ma-1"
              color="error"
              plain
              @click="deleteComponent()"
            >
              Delete
            </v-btn>
          </v-sheet>
        </v-dialog>
      </v-col>
    </v-row>
    <div
      v-if="
        NoteComponent.type !== 'page' ||
        NoteComponent._id === $route.params.note_id
      "
    >
      <v-row
        aling="center"
        v-for="content in NoteComponent.properties.content"
        :key="content"
      >
        <v-spacer></v-spacer>
        <v-col cols="11" class="ma-0 pa-0">
          <div class="child">
            <note-component :id="content"></note-component>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="add_dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Add new note component
        </v-card-title>
        <v-container>
          <v-row aling="center">
            <v-col>
              <div class="mb-4">Select Note Type:</div>
              <div>
                <v-select
                  :items="items"
                  v-model="type"
                  :rules="[(v) => !!v || 'Type is required']"
                ></v-select>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-text-field
              class="mt-4 pl-3 pr-3"
              label="Note"
              v-model="new_text"
              hide-details="auto"
              :rules="[(v) => !!v || 'Text is required']"
            ></v-text-field>
          </v-row>
        </v-container>
        <v-card-text> </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div v-if="show_empty_note_error" class="red--text">
            Please insert a note
          </div>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="putNote(type)"> DONE </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row
      v-if="
        NoteComponent.type === 'page' &&
        NoteComponent._id === $route.params.note_id
      "
    >
      <v-col>
        <div class="text-center">
          <v-btn
            class="mt-4 white--text"
            color="indigo darken-5"
            fab
            outlined
            @click="add_dialog = true"
            ><v-icon> mdi-plus </v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "note-component",
  props: {
    id: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      completed: true,
      delete_dialog: false,
      edit_dialog: false,
      add_dialog: false,
      new_text: null,
      note_edit_text: null,
      loading: false,
      items: ["Bullet List", "Check List", "Title", "Paragraph", "Page"],
      show_empty_note_error: false,
      type: "Title",
    };
  },
  pouch: {
    // The simplest usage. queries all documents from the "todos" pouch database and assigns them to the "todos" vue property.
    NoteComponent() {
      return {
        database: this.$store.state.user.db.name,
        selector: { _id: this.id },
        first: true,
      };
    },
  },
  computed: {
    disabled() {
      return this.NoteComponent.type === "page";
    },
  },
  methods: {
    completeCheck() {
      if (this.NoteComponent.properties.completed) {
        this.completed = false;
      } else {
        this.completed = true;
      }

      this.putCheck(this.completed);
    },

    putCheck(boolean) {
      let note = {
        _id: this.NoteComponent._id,
        _rev: this.NoteComponent._rev,
        type: "check",
        text: this.NoteComponent.text,
        properties: {
          completed: boolean,
          content: this.NoteComponent.properties.content,
        },
        parent: this.NoteComponent.parent,
      };
      this.$pouch
        .put(note, {}, this.$store.state.user.db.name)
        .then((doc) => {
          console.log(doc);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    putNote(type) {
      if (this.new_text !== null && type !== undefined) {
        this.show_empty_note_error = false;
        let new_id;
        if (type === "Bullet List") {
          new_id = this.putBullet();
        } else if (type === "Check List") {
          new_id = this.putNewCheck();
        } else if (type === "Paragraph") {
          new_id = this.putParagraph();
        } else if (type === "Title") {
          new_id = this.putTitle();
        } else if (type === "Page") {
          new_id = this.putPage();
        }
        this.updateParent(new_id);
      } else {
        this.show_empty_note_error = true;
      }
    },

    putBullet() {
      let note = {
        _id: new Date().toISOString(),
        type: "bullet",
        text: this.new_text,
        properties: {
          icon: "circle",
          content: [],
        },
        parent: this.NoteComponent._id,
      };
      this.$pouch
        .put(note, {}, this.$store.state.user.db.name)
        .then((doc) => {
          console.log(doc);
          this.new_text = null;
          this.add_dialog = false;
        })
        .catch((err) => {
          console.log(err);
          this.new_text = null;
          this.add_dialog = false;
        });
      return note._id;
    },
    putNewCheck() {
      let note = {
        _id: new Date().toISOString(),
        type: "check",
        text: this.new_text,
        properties: {
          completed: false,
          content: [],
        },
        parent: this.NoteComponent._id,
      };
      console.log("newcheck", note);
      this.$pouch
        .put(note, {}, this.$store.state.user.db.name)
        .then((doc) => {
          console.log(doc);
          this.new_text = null;
          this.add_dialog = false;
        })
        .catch((err) => {
          console.log(err);
          this.new_text = null;
          this.add_dialog = false;
        });
      return note._id;
    },

    putTitle() {
      let note = {
        _id: new Date().toISOString(),
        type: "title",
        text: this.new_text,
        properties: {
          content: [],
        },
        parent: this.NoteComponent._id,
      };
      this.$pouch
        .put(note, {}, this.$store.state.user.db.name)
        .then((doc) => {
          console.log(doc);
          this.new_text = null;
          this.add_dialog = false;
        })
        .catch((err) => {
          console.log(err);
          this.new_text = null;
          this.add_dialog = false;
        });
      return note._id;
    },

    putParagraph() {
      let note = {
        _id: new Date().toISOString(),
        type: "paragraph",
        text: this.new_text,
        properties: {
          content: [],
        },
        parent: this.NoteComponent._id,
      };
      this.$pouch
        .put(note, {}, this.$store.state.user.db.name)
        .then((doc) => {
          console.log(doc);
          this.new_text = null;
          this.add_dialog = false;
        })
        .catch((err) => {
          console.log(err);
          this.new_text = null;
          this.add_dialog = false;
        });
      return note._id;
    },

    putPage() {
      let note = {
        _id: new Date().toISOString(),
        type: "page",
        text: this.new_text,
        properties: {
          content: [],
        },
        parent: this.NoteComponent._id,
      };
      this.$pouch
        .put(note, {}, this.$store.state.user.db.name)
        .then((doc) => {
          console.log(doc);
          this.new_text = null;
          this.add_dialog = false;
          this.$router.push("/note/" + note._id);
        })
        .catch((err) => {
          console.log(err);
          this.new_text = null;
          this.add_dialog = false;
        });
      return note._id;
    },
    updateParent(child_id) {
      let properties = this.NoteComponent.properties;
      let new_content = this.NoteComponent.properties.content;
      new_content.push(child_id);
      properties.content = new_content;

      let updated_note = {
        _id: this.NoteComponent._id,
        _rev: this.NoteComponent._rev,
        type: this.NoteComponent.type,
        text: this.NoteComponent.text,
        properties: properties,
        parent: this.NoteComponent.parent,
      };
      this.$pouch
        .put(updated_note, {}, this.$store.state.user.db.name)
        .then((doc) => {
          console.log(doc);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteComponent() {
      this.loading = true;
      let parent_id = this.NoteComponent.parent;
      let component_id = this.NoteComponent._id;
      if (parent_id !== null) {
        this.$pouch
          .get(parent_id)
          .then((doc) => {
            this.editComponentContent(doc, component_id);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.deleteRec(this.NoteComponent);

      this.delete_dialog = false;
      this.loading = false;
    },

    deleteRec(note) {
      if (note.properties.content.length !== 0) {
        note.properties.content.forEach((note_id) => {
          this.$pouch.get(note_id).then((doc) => {
            this.deleteRec(doc);
          });
        });
      }
      this.$pouch
        .remove(note, {}, this.$store.state.user.db.name)
        .catch((err) => {
          console.log(err);
        });
    },

    editComponent() {
      this.loading = true;
      this.$pouch
        .put(
          {
            _id: this.NoteComponent._id,
            _rev: this.NoteComponent._rev,
            type: this.NoteComponent.type,
            text: this.note_edit_text,
            properties: this.NoteComponent.properties,
            parent: this.NoteComponent.parent,
          },
          {},
          this.$store.state.user.db.name
        )
        .then(() => {
          this.edit_dialog = false;
          this.note_edit_text = null;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.delete_dialog = false;
          this.note_edit_text = null;
          this.loading = false;
        });
    },
    editComponentContent(doc, id) {
      let new_properties = doc.properties;
      let new_content = doc.properties.content;
      for (var i = 0; i < new_content.length; i++) {
        if (new_content[i] === id) {
          new_content.splice(i, 1);
        }
      }
      new_properties.content = new_content;
      this.$pouch
        .put(
          {
            _id: doc._id,
            _rev: doc._rev,
            type: doc.type,
            text: doc.text,
            properties: new_properties,
            parent: doc.parent,
          },
          {},
          this.$store.state.user.db.name
        )
        .then((edited_doc) => {
          console.log(edited_doc);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
