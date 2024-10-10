import './assets/main.css'
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { initializeApp } from "firebase/app";
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmationService from "primevue/confirmationservice";
import Message from "primevue/message";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import DatePicker from 'primevue/datepicker';
import RadioButton from "primevue/radiobutton";
import Badge from "primevue/badge";
import Tooltip from "primevue/tooltip";
import Chart from "primevue/chart";

import App from './App.vue'
import router from './router'

const firebaseConfig = {
    apiKey: "AIzaSyBTtbcVKmgkk15dgBI4hLJno1qGv3fPFiw",
    authDomain: "interviews-7a856.firebaseapp.com",
    projectId: "interviews-7a856",
    storageBucket: "interviews-7a856.appspot.com",
    messagingSenderId: "822196208520",
    appId: "1:822196208520:web:aac3066e5a9cca8710f03d"
};


initializeApp(firebaseConfig);

const app = createApp(App)

app.use(createPinia())
app.use(ToastService)
app.use(ConfirmationService)
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.directive('tooltip', Tooltip)
app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner)
app.component('app-card', Card)
app.component('app-datatable', DataTable)
app.component('app-column', Column)
app.component('app-dialog', ConfirmDialog)
app.component('app-message', Message)
app.component('app-input-number', InputNumber)
app.component('app-textarea', Textarea)
app.component('app-calendar', DatePicker)
app.component('app-radio', RadioButton)
app.component('app-badge', Badge)
app.component('app-chart', Chart)



app.mount('#app')
