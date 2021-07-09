<template>
  <v-container class="parent" v-if="NoteComponent">
    <v-row aling="center" justify="center" v-if="NoteComponent.parent">
      <v-col cols="5">
        <h1
          class="ml-2 text-center blue--text"
          v-if="NoteComponent.type === 'page'"
        >
          {{ NoteComponent.text }}
        </h1>
        <h3 class="ml-2" v-if="NoteComponent.type === 'title'">
          {{ NoteComponent.text }}
        </h3>
        <div
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

      <v-col align="end" cols="2">
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
                    v-model="note_content_text"
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
        <v-btn icon color="indigo">
          <v-icon>mdi-plus </v-icon>
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
    <v-row
      aling="center"
      justify="center"
      v-for="content in NoteComponent.properties.content"
      :key="content"
    >
      <v-col cols="9">
        <div class="child">
          <note-component :id="content"></note-component>
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
      note_content_text: null,
      loading: false,
    };
  },
  pouch: {
    // The simplest usage. queries all documents from the "todos" pouch database and assigns them to the "todos" vue property.
    NoteComponent() {
      console.log("ID !!!!!");
      console.log(this.id);
      return {
        database: this.$store.state.user.db.name,
        selector: { _id: this.id },
        first: true,
      };
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
    deleteComponent() {
      this.loading = true;
      this.$pouch
        .remove(this.NoteComponent, {}, this.$store.state.user.db.name)
        .then(() => {
          this.delete_dialog = false;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.delete_dialog = false;
          this.loading = false;
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
            text: this.note_content_text,
            properties: this.NoteComponent.properties,
            parent: this.NoteComponent.parent,
          },
          {},
          this.$store.state.user.db.name
        )
        .then(() => {
          this.edit_dialog = false;
          this.note_content_text = null;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.delete_dialog = false;
          this.note_content_text = null;
          this.loading = false;
        });
    },
  },
};
</script>
