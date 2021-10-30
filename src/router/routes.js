import Vue from 'vue';
import VueRouter from 'vue-router';

// Common pages
import Login from '../components/Login';
import ResetPassword from '../components/ResetPassword';

// PowerUser pages
import PowerUserWIP from '../components/poweruser/PowerUserWIP';
import PowerUserLogin from '../components/poweruser/PowerUserLogin';
import PowerUserSignUp from '../components/poweruser/PowerUserSignUp';
import PowerUserDashboard from '../components/poweruser/PowerUserDashboard';
import PowerUserDME from '../components/poweruser/PowerUserDME';
import ManageItemSupplies from '../components/poweruser/ManageItemSupplies';
import PowerUserAcuteCare from '../components/poweruser/PowerUserAcuteCare';
import PowerUserSurgical from '../components/poweruser/PowerUserSurgical';
import PowerUserALL from '../components/poweruser/PowerUserALL';

// User pages
import UserWIP from '../components/user/UserWIP';
import UserLogin from '../components/user/UserLogin';
import UserSignUp from '../components/user/UserSignUp';

Vue.use(VueRouter);

const routes = [ 
    { path: '/', component: Login },
    { path: '/resetpassword', component: ResetPassword },
    
    { path: '/poweruserwip', component: PowerUserWIP}, 
    { path: '/poweruserlogin', component: PowerUserLogin },
    { path: '/powerusersignup', component: PowerUserSignUp },
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
        },
        {
            path: '/poweruserall',
            component: PowerUserALL
        }
    ]},
    { path: '/manageitemsupplies', component: ManageItemSupplies },

    { path: '/userwip', component: UserWIP}, 
    { path: '/userlogin', component: UserLogin },
    { path: '/usersignup', component: UserSignUp },
];

const router = new VueRouter({
    mode: 'history',
    // base: 'localhost:8080',
    routes
});

export default router;

