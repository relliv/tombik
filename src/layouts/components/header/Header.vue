<template>
  <header class="header">
    <!-- Greeting -->
    <div class="greeting">
      <div class="name">
        {{ appStore.pageTitle }}
      </div>

      <div class="message">
        {{ appStore.pageDescription }}
      </div>

      <!-- Edit Button -->
      <Dialog>
        <DialogTrigger>
          <button class="edit">
            <Pen />
          </button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <form @submit="editName">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Update your profile information
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label for="name" class="text-right"> Name </Label>
              <Input v-model="newUsername" id="name" :placeholder="name" />
            </div>
            <DialogFooter>
              <Button @click="editName" type="submit" class="mt-4">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Search -->
    <div class="search">
      <Input placeholder="Search..." />
    </div>
  </header>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import localForage from "localforage";
import { Pen } from "lucide-vue-next";
import { Label } from "radix-vue";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/shared/stores/app.store";

const appStore = useAppStore();

const name = ref<string>("");
const newUsername = ref("");

onMounted(async () => {
  name.value = (await localForage.getItem("username")) as string;
});

const editName = async () => {
  if (newUsername.value) {
    await localForage.setItem("username", newUsername.value);
    window.location.reload();
  } else {
    alert("Please enter a valid name");
  }
};
</script>

<style scoped>
@import "./header.scss";
</style>
