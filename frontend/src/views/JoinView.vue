<script setup lang="ts">
import CreateNewFlat from '@/components/flat/CreateNewFlat.vue';
import JoinExistingFlat from '@/components/flat/JoinExistingFlat.vue';</script>

<template>
    <div class="flex flex-col w-full lg:flex-row">
        
        <div class="card text-center shadow-2xl p-12 flex-grow m-10 place-items-center">
            <div class="card-body">
                <h2 class="card-title">Create a new flat for your not existing friends. </h2> 
                <p>You silly bloody wanker</p> 
                <div class="p-4 justify-center card-actions">
                    <CreateNewFlat/>
                </div>
            </div>
        </div> 

    <div class="divider m-6 lg:divider-vertical">OR</div> 

        <div class="card text-center flex-grow m-10 shadow-2xl p-12">
            <div class="card-body">
                <h2 class="card-title">Join an existing one. </h2> 
                <p>Honestly, who you're lying to? You don't have any friends. You are still a silly bloody wanker</p> 
                <div class="p-4 justify-center card-actions">
                    <JoinExistingFlat/>
                </div>
            </div>
        </div> 
    </div>
</template>
