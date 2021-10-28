import Vue from 'vue';
import VueRouter from 'vue-router';

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


// User pages
import UserWIP from '../components/user/UserWIP';
import UserLogin from '../components/user/UserLogin';
import UserSignUp from '../components/user/UserSignUp';
import UserRequestView from '../components/user/UserRequestView';

Vue.use(VueRouter);

const routes = [ 
    { path: '/', component: Login },
    { path: '/resetpassword', component: ResetPassword },
    
    
    { path: '/poweruserwip', component: PowerUserWIP}, 
    { path: '/poweruserlogin', component: PowerUserLogin },
    { path: '/powerusersignup', component: PowerUserSignUp },
    { path: '/poweruserapprovalsystem', component: PowerUserApprovalSystem}, 
    { path: '/poweruserdashboard', component: PowerUserDashboard, 
    children: [
        {
            path: '/poweruserdme',
            component: PowerUserDME,
        },
        {
            path: '/poweruseracutecare',
            component: PowerUserAcuteCare,
        },
        {
            path: '/powerusersurgical',
            component: PowerUserSurgical,
        }
    ]},
    { path: '/poweruseradditems', component: PowerUserAddItems },


    { path: '/userwip', component: UserWIP}, 
    { path: '/userlogin', component: UserLogin },
    { path: '/usersignup', component: UserSignUp },
    { path: '/userrequestview', component: UserRequestView }

];

const router = new VueRouter({
    mode: 'history',
    // base: 'localhost:8080',
    routes
});

export default router;

