<script setup lang="ts">
import {ref, onMounted} from "vue"
import {getFirestore, doc, getDoc, updateDoc, Timestamp} from 'firebase/firestore'
import {useUserStore} from "@/stores/user"
import type {IInterview, IStage} from '@/interfaces'
import {useRoute} from  "vue-router"
import dayjs from "dayjs"

const db = getFirestore()
const userStore = useUserStore()
const route = useRoute()

const isLoading = ref(true)
const interview = ref<IInterview>() //?

const docref = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const docSnap = await getDoc(docref)

  if(docSnap.exists()) {
    const data = docSnap.data() as IInterview

    if (data.stages && data.stages.length) {
      data.stages = data.stages.map((stage: IStage) => {
        if (stage.date && stage.date instanceof Timestamp) {
          return {
            ...stage,
            date: stage.date.toDate()
          }
        }
        return stage
      })
    }
    interview.value = data
  }
  isLoading.value = false
}
const addStage = () => {
  if (interview.value)  {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({name: '', date: null, description: ''})
  }
}

const removeStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index,1)
    }
  }
}

const saveInterview = async (): Promise<void> => {
  isLoading.value = true
  await updateDoc(docref, {...interview.value})
  await getData()
  isLoading.value = false
}

onMounted(async () => await getData())
</script>

<template>
  <app-progress v-if="isLoading"/>
<div v-else-if="interview?.id && !isLoading" class="class-interview">
  <app-card>
    <template #title>Собеседование в компанию {{ interview.company }}</template>
    <template #content>
      <div class="flex flex-column gap-2">
        <label for="company">Компания</label>
        <app-input-text class="input mb-3" id="company" v-model="interview.company"/>
      </div>
      <div class="flex flex-column gap-2">
        <label for="vacancyLink">Описание Вакансии (ссылка)</label>
        <app-input-text class="input mb-3" id="vacancyLink" v-model="interview.vacancyLink"/>
      </div>
      <div class="flex flex-column gap-2">
        <label for="hrName">Контакт (имя)</label>
        <app-input-text class="input mb-3" id="hrName" v-model="interview.hrName"/>
      </div>
      <div class="flex flex-column gap-2">
        <label for="contactTelegram">Telegram username HR</label>
        <app-input-text class="input mb-3" id="contactTelegram" v-model="interview.contactTelegram"/>
      </div>
      <div class="flex flex-column gap-2">
        <label for="contactWhatsApp">WhatsApp</label>
        <app-input-text class="input mb-3" id="contactWhatsApp" v-model="interview.contactWhatsApp"/>
      </div>
      <div class="flex flex-column gap-2">
        <label for="contactPhone">Телефон HR</label>
        <app-input-text class="input mb-3" id="contactPhone" v-model="interview.contactPhone"/>
        </div>
      <div class="flex flex-wrap gap-3 p-fluid mb-3">
        <div class="flex-1">
          <app-input-number class="w-full mr-2" v-model="interview.salaryFrom" inputId="salaryFrom" placeholder="Зарплатная вилка от"/>
        </div>
        <div class="flex-1">
          <app-input-number class="w-full" v-model="interview.salaryTo" inputId="salaryTo" placeholder="Зарплатная вилка до"/>
        </div>
      </div>

      <app-button label="Добавить этап" severity="info" icon="pi pi-plus" @click="addStage"/>
      <template v-if="interview.stages">
      <div v-for="(stage, index) in interview.stages" :key="index" class="interview-stage">
        <div class="flex flex-column gap-2">
          <label :for="`stage-name-${index}`">Название этапа</label>
          <app-input-text class="input mb-3" :id="`stage-name-${index}`" v-model="stage.name"/>
        </div>
        <div class="flex flex-column gap-2">
          <label :for="`stage-date-${index}`">Дата прохождения этапа</label>
          <app-calendar v-model="stage.date" class="input mb-3" :id="`stage-date-${index}`" dateFormat="dd.mm.yy"/>
        </div>
        <div class="flex flex-column gap-2">
          <label :for="`stage-description-${index}`">Комментарий</label>
          <app-textarea v-model="stage.description" class="input mb-3" :id="`stage-description-${index}`" rows="5"/>
        </div>
        <app-button severity="danger" label="Удалить этап" @click="removeStage"/>
      </div>
      </template>
      <div class="flex flex-wrap gap-3 m-3">
        <div class="flex align-items-center">
          <app-radio inputId="interviewResult1" style="--p-radiobutton-checked-background: red;" name="result" value="Refusal" v-model="interview.result"/>
          <label for="interviewResult1" class="ml-2">Отказ</label>
        </div>
        <div class="flex align-items-center">
          <app-radio inputId="interviewResult2" name="result" value="Offer" v-model="interview.result"/>
          <label for="interviewResult2" class="ml-2">Оффер</label>
        </div>
        <div class="flex align-items-center">
          <app-radio inputId="interviewResult3" style="--p-radiobutton-checked-background: blue;" name="result" checked value="inProgress" v-model="interview.result"/>
          <label for="interviewResult3"  class="ml-2">В процессе</label>
        </div>
      </div>
      <app-button class="mt-2" label="Сохранить" icon="pi pi-save" @click="saveInterview"/>
    </template>
  </app-card>
</div>
</template>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>