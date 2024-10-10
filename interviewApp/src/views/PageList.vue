<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import {useUserStore} from "@/stores/user";
import type {IInterview} from "@/interfaces";
import {useConfirm} from "primevue/useconfirm";





const userStore = useUserStore();
const db = getFirestore();
const confirm = useConfirm()
const selectedFilterResult = ref<string>('')
const interviews = ref<IInterview[]>([]);
const isLoading = ref<boolean>(true);


const getAllInterviews = async <T extends IInterview>(isFilter?: boolean): Promise<T[]> => {

  let getData;

if (isFilter) {
  getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc'),
      where('result', '==', selectedFilterResult.value)
  )

} else {
  getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc')
  )
}
  const listDocs = await getDocs(getData)
  return listDocs.docs.map((doc) => doc.data() as T)
}
onMounted(async () => {
    interviews.value =  await getAllInterviews()
    isLoading.value = false
})



const confirmRemoveInterview = async (id: string): Promise<void> => {
confirm.require({
  message: "Вы хотите удалить собеседование?",
  header: "Удаление собеседования",
  icon: "pi pi-info-circle",
  rejectLabel: "Отмена",
  acceptLabel: "Удалить",
  rejectClass: "p-button-secondary p-button-outlined",
  acceptClass: "p-button-danger",
  accept: async () => {
isLoading.value = true;
await deleteDoc(doc(db, `users/${userStore.userId}/interviews`,id))
    interviews.value =  await getAllInterviews()
    isLoading.value = false
    }
   })
 }

 const submitFilter = async (): Promise<void> => {
  isLoading.value = true
   interviews.value =  await getAllInterviews(true)
   isLoading.value = false
 }

const clearFilter = async (): Promise<void> => {
  isLoading.value = true
  interviews.value =  await getAllInterviews()
  isLoading.value = false
}

</script>

<template>
  <app-dialog/>
  <app-progress v-if="isLoading"/>
  <app-message v-else-if="!isLoading && !interviews.length" severity="info">
    Нет добавленных собеседований
    </app-message>
  <div v-else>
<h1>Список собеседований</h1>
    <div class="flex align-items-center mb-5">
      <div class="flex align-items-center">
        <app-radio
            inputId="interviewResult1"
            style="--p-radiobutton-checked-background: red;"
            name="result"
            value="Refusal"
            v-model="selectedFilterResult"
        />
        <label for="interviewResult1" class="mr-2 ml-1">Отказ</label>
      </div>
      <div class="flex align-items-center ">
        <app-radio
            inputId="interviewResult1"
            name="result"
            value="Offer"
            v-model="selectedFilterResult"
        />
        <label for="interviewResult2" class="mr-2 ml-1">Оффер</label>
      </div>
      <div class="flex align-items-center ">
        <app-radio
            inputId="interviewResult1"
            name="result"
            value="inProgress"
            v-model="selectedFilterResult"
        />
        <label for="interviewResult2" class="mr-2 ml-1">В процессе</label>
      </div>
      <app-button class="mr-2" @click="submitFilter" :disabled="!selectedFilterResult">Применить</app-button>
      <app-button class="mr-2" severity="danger" @click="clearFilter" :disabled="!selectedFilterResult">Сбросить</app-button>
    </div>

  <app-datatable :value="interviews">
    <app-column field="company" header="Компания"></app-column>
    <app-column field="hrName" header="Имя HR"></app-column>
    <app-column field="vacancyLink" header="Вакансия">
      <template #body="slotProps">
        <a :href="slotProps.data.vacancyLink" target="_blank">Ссылка на вакансию</a>
      </template>
    </app-column>
    <app-column header="Контакты">
      <template #body="slotProps">
        <a
            v-if="slotProps.data.contactTelegram"
            :href="`https://t.me/${slotProps.data.contactTelegram}`"
            target="_blank"
            class="contacts__telegram"
        >
          <span class="contacts_icon pi pi-telegram  "></span>
        </a>
        <a
            v-if="slotProps.data.contactWhatsApp"
            :href="`https://wa.me/${slotProps.data.contactWhatsApp}`"
            target="_blank"
            class="contacts__whatsapp"
        >
          <span class="contacts_icon pi pi-whatsapp  ml-3"></span>
        </a>
        <a
            v-if="slotProps.data.contactPhone"
            :href="`https://tel:${slotProps.data.contactPhone}`"
            target="_blank"
            class="contacts__phone"
        >
          <span class="contacts_icon pi pi-phone ml-3"></span>
        </a>
      </template>
      </app-column>
    <app-column header="Пройденные этапы">
      <template #body="slotProps">
      <span v-if="!slotProps.data.stages">Не заполнено</span>
      <app-badge class="ml-2" severity="info" v-tooltip.top="stage.name" v-for="(stage, i) in slotProps.data.stages" :key="i" :value="i + 1" rounded/>
      </template>
    </app-column>
    <app-column header="Зарплатная вилка">
      <template #body="slotProps">
        <span v-if="!slotProps.data.salaryFrom">Не заполнено</span>
        <span v-else>{{slotProps.data.salaryFrom}} - {{slotProps.data.salaryTo}}</span>
      </template>
    </app-column>
    <app-column header="Результат">
      <template #body="slotProps">
        <app-badge v-if="slotProps.data.result === 'Offer'" severity="success" value="Оффер"/>
        <app-badge v-else-if="slotProps.data.result === 'inProgress'" severity="info" value="В процессе"/>
        <app-badge v-else severity="danger" value="Отказ"/>
      </template>
    </app-column>
    <app-column>
      <template #body="slotProps">
<div class="flex gap-2">
  <router-link :to="`/interview/${slotProps.data.id}`">
    <app-button icon="pi pi-pencil" severity="info"/>
  </router-link>
  <app-button icon="pi pi-trash"  severity="danger" @click="confirmRemoveInterview(slotProps.data.id)"/>
</div>
      </template>
    </app-column>
  </app-datatable>
  </div>
</template>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
.interview-stages {
  display: flex;
  gap: 5px;
}
</style>