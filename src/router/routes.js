
import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from '@/uifire.js'

// Common pages
import Login from '../components/Login';
import ResetPassword from '../components/ResetPassword';

// PowerUser pages
import PowerUserWIP from '../components/poweruser/PowerUserWIP';
import PowerUserLogin from '../components/poweruser/PowerUserLogin';
import PowerUserSignUp from '../components/poweruser/PowerUserSignUp';
import PowerUserApprovalSystem from '../components/poweruser/PowerUserApprovalSystem';

import PowerUserDashboard from '../components/poweruser/PowerUserDashboard';
import PowerUserDME from '../components/poweruser/PowerUserDME';
import PowerUserAddItems from '../components/poweruser/PowerUserAddItems';
import PowerUserAcuteCare from '../components/poweruser/PowerUserAcuteCare';
import PowerUserSurgical from '../components/poweruser/PowerUserSurgical';
import PowerUserALL from '../components/poweruser/PowerUserALL';
import PowerUserSupplyOrderForm from '../components/poweruser/PowerUserSupplyOrderForm';
import RequestForm from '../components/RequestForm';
import PowerUserTrackArrival from '../components/poweruser/PowerUserTrackArrival';
import PowerUserInventoryInsights from '../components/poweruser/PowerUserInventoryInsights';
import PowerUserRequestInsights from '../components/poweruser/PowerUserRequestInsights';

// User pages
import UserWIP from '../components/user/UserWIP';
import UserLogin from '../components/user/UserLogin';
import UserSignUp from '../components/user/UserSignUp';
import UserRequestView from '../components/user/UserRequestView';

Vue.use(VueRouter);

const routes = [ 
    { path: '/', component: Login },
    { path: '/resetpassword', component: ResetPassword },
    { path: '/requestform', component: RequestForm},  
    
    
    { path: '/poweruserwip', component: PowerUserWIP}, 
    { path: '/poweruserlogin', component: PowerUserLogin },
    { path: '/powerusersignup', component: PowerUserSignUp },
    { path: '/poweruserapprovalsystem', component: PowerUserApprovalSystem , meta: {requiresAuth: true} }, 
    { path: '/poweruserdashboard', component: PowerUserDashboard,
        children: [
            { path: '/poweruserdme', component: PowerUserDME }, 
            { path: '/poweruseracutecare', component: PowerUserAcuteCare },
            { path: '/powerusersurgical', component: PowerUserSurgical },
            { path: '/poweruserall', component: PowerUserALL }
        ]
    },
    { path: '/poweruseradditems', component: PowerUserAddItems, meta: {requiresAuth: true} },
    { path: '/powerusersupplyorder', component: PowerUserSupplyOrderForm, meta: {requiresAuth: false} },
    { path: '/powerusertrackarrival', component: PowerUserTrackArrival, meta: {requiresAuth: false} },
    { path: '/poweruserinventoryinsights', component: PowerUserInventoryInsights, meta: {requiresAuth: false} },
    { path: '/poweruserrequestinsights', component: PowerUserRequestInsights, meta: {requiresAuth: false} },    
    

    { path: '/userwip', component: UserWIP, meta: {requiresAuth: true} }, 
    { path: '/userlogin', component: UserLogin },
    { path: '/usersignup', component: UserSignUp },
    { path: '/userrequestview', component: UserRequestView }
    


];

const router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    // https://www.freecodecamp.org/news/authentication-with-vue-js-firebase-5c3a82149f66/
    const currentUser = firebase.auth().currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !currentUser) {
        alert("You are not logged in! Bringing you back to your main page")
        next('/');
    } else {
        next();
    }
});

export default router;

