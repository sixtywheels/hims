
import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from '@/uifire.js'

// Common pages
import Login from '../components/Login';
import ResetPassword from '../components/ResetPassword';

// PowerUser pages
// import PowerUserWIP from '../components/poweruser/PowerUserWIP';
import PowerUserLogin from '../components/poweruser/PowerUserLogin';
import PowerUserSignUp from '../components/poweruser/PowerUserSignUp';
import PowerUserApprovalSystem from '../components/poweruser/PowerUserApprovalSystem';

import PowerUserDashboard from '../components/poweruser/PowerUserDashboard';
import PowerUserDME from '../components/poweruser/PowerUserDME';
import PowerUserAddItems from '../components/poweruser/PowerUserAddItems';
import PowerUserCOVID19 from '../components/poweruser/PowerUserCOVID19';
import PowerUserSurgical from '../components/poweruser/PowerUserSurgical';
import PowerUserALL from '../components/poweruser/PowerUserALL';
import PowerUserSupplyOrderForm from '../components/poweruser/PowerUserSupplyOrderForm';
import RequestForm from '../components/RequestForm';
import PowerUserTrackArrival from '../components/poweruser/PowerUserTrackArrival';
import PowerUserInventoryInsights from '../components/poweruser/PowerUserInventoryInsights';
import PowerUserRequestInsights from '../components/poweruser/PowerUserRequestInsights';

// User pages
// import UserWIP from '../components/user/UserWIP';
import UserLogin from '../components/user/UserLogin';
import UserSignUp from '../components/user/UserSignUp';
import UserRequestView from '../components/user/UserRequestView';
import UserRequestForm from '../components/user/UserRequestForm';
import UserDashboard from '../components/user/UserDashboard';
import UserALL from '../components/user/UserALL';
import UserCOVID19 from '../components/user/UserCOVID19';
import UserDME from '../components/user/UserDME';
import UserSurgical from '../components/user/UserSurgical';
import UserPastRequest from '../components/user/UserPastRequest';

Vue.use(VueRouter);

const routes = [ 
    { path: '/', component: Login },
    { path: '/resetpassword', component: ResetPassword },
    { path: '/requestform', component: RequestForm},  
    
    
    // { path: '/poweruserwip', component: PowerUserWIP}, 
    { path: '/poweruserlogin', component: PowerUserLogin },
    { path: '/powerusersignup', component: PowerUserSignUp },
    { path: '/poweruserapprovalsystem', component: PowerUserApprovalSystem , meta: {requiresAuth: true} }, 
    { path: '/poweruserdashboard', component: PowerUserDashboard, meta: {requiresAuth: true},
        children: [
            { path: '/poweruserdme', component: PowerUserDME, meta: {requiresAuth: true} }, 
            { path: '/powerusercovid19', component: PowerUserCOVID19, meta: {requiresAuth: true} },
            { path: '/powerusersurgical', component: PowerUserSurgical, meta: {requiresAuth: true} },
            { path: '/poweruserall', component: PowerUserALL, meta: {requiresAuth: true} }
        ]
    },
    { path: '/poweruseradditems', component: PowerUserAddItems, meta: {requiresAuth: true} },
    { path: '/powerusersupplyorder', component: PowerUserSupplyOrderForm, meta: {requiresAuth: true} },
    { path: '/powerusertrackarrival', component: PowerUserTrackArrival, meta: {requiresAuth: true} },
    { path: '/poweruserinventoryinsights', component: PowerUserInventoryInsights, meta: {requiresAuth: true} },
    { path: '/poweruserrequestinsights', component: PowerUserRequestInsights, meta: {requiresAuth: true} },    
    

    // { path: '/userwip', component: UserWIP, meta: {requiresAuth: true} }, 
    { path: '/userlogin', component: UserLogin },
    { path: '/usersignup', component: UserSignUp },
    { path: '/userrequestview', component: UserRequestView, meta: {requiresAuth: true} },
    { path: '/userrequestform', component: UserRequestForm, meta: {requiresAuth: true} },
    { path: '/userpastrequest', component: UserPastRequest, meta: {requiresAuth: true} },
    { path: '/userdashboard', component: UserDashboard, meta: {requiresAuth: true}, 
        children: [
            { path: '/userdme', component: UserDME, meta: {requiresAuth: true}  }, 
            { path: '/usercovid19', component: UserCOVID19, meta: {requiresAuth: true}  },
            { path: '/usersurgical', component: UserSurgical, meta: {requiresAuth: true}  },
            { path: '/userall', component: UserALL, meta: {requiresAuth: true}  }
        ]
    },

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

