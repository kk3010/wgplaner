<script lang="ts" setup>
import { IUser } from '@interfaces/user.interface'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  members: IUser[]
  modelValue: number[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue'): void
}>()

const model = useVModel(props, 'modelValue', emit)
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="member in members" :key="member.id">
        <th class="transition" :class="{ '!bg-gray-200 text-gray-500': !model.includes(member.id) }">
          <label>
            <input type="checkbox" class="checkbox" :value="member.id" v-model="model" />
          </label>
        </th>
        <td class="transition" :class="{ '!bg-gray-200 text-gray-500': !model.includes(member.id) }">
          <div class="flex items-center space-x-2">
            <div class="avatar placeholder">
              <div class="bg-neutral-focus text-neutral-content w-12 h-12 mask mask-squircle uppercase">
                <span>{{ member.firstName[0] + member.lastName[0] }}</span>
              </div>
            </div>
            <div class="font-bold">
              {{ [member.firstName, member.lastName].join(' ') }}
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
