<template>
  <v-container class="parent">
    <v-row aling="center">
      <v-col>
        <h1 class="ml-2 text-center" v-if="NoteComponent.type === 'page'">
          {{ NoteComponent.properties.text }}
        </h1>

        <h3 class="ml-2" v-if="NoteComponent.type === 'title'">
          {{ NoteComponent.properties.text }}
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
          {{ NoteComponent.properties.text }}
        </div>
      </v-col>
    </v-row>
    <v-row
      aling="center"
      v-for="content in NoteComponent.properties.content"
      :key="content"
    >
      <div class="child">
        <note-component :id="content"></note-component>
      </div>
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
        properties: {
          text: this.NoteComponent.properties.text,
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
  },
};
</script>
