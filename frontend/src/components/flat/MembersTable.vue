<script lang="ts" setup>
import { IUser } from '@interfaces/user.interface'
import { useVModel } from '@vueuse/core'
import { useUser } from '../../composables/useUser'
import UserAvatar from '../user/UserAvatar.vue'

const { user } = useUser()

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
        <th class="transition" :class="model.includes(member.id) ? 'bg-neutral-focus' : '!bg-neutral text-gray-400'">
          <label>
            <input type="checkbox" class="checkbox" :value="member.id" v-model="model" />
          </label>
        </th>
        <td class="transition" :class="model.includes(member.id) ? 'bg-neutral-focus' : '!bg-neutral text-gray-400'">
          <div class="flex items-center space-x-2">
            <UserAvatar :user="member" />
            <div>
              <span class="font-bold">
                {{ [member.firstName, member.lastName].join(' ') }}
              </span>
              <span v-if="member.id === user?.id" class="ml-2">(Me)</span>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
