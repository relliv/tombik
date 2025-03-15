<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" class="flex flex-row gap-2">
        <span>Options</span> <EllipsisVertical :size="18" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuGroup>
        <!-- Rename -->
        <DropdownMenuItem>
          <span>Rename</span>
        </DropdownMenuItem>

        <!-- Open In File Manager -->
        <DropdownMenuItem>
          <span>Open In File Manager</span>
        </DropdownMenuItem>

        <!-- Delete -->
        <DropdownMenuItem>
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-vue-next";
</script>

<style scoped lang="scss"></style>
