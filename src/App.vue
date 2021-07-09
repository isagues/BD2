<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    items: ["Bullet List", "Check List", "Title", "Paragraph"],
  }),
};
</script>
