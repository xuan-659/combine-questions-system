import { teacherFunctionList } from '../common/mock/compose-viewer/function-list';
import { personalFunctionList } from '@/common/mock/personal-center/function-list';
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Signin from '@/components/signin';
import Main from '@/components/main';
import ComposeViewer from '@/components/compose-viewer';
import personalViewer from '@/components/personal-center';
import Storage from '@/utlis/localStorage';
import { 
  COMPOSE_VIEWER_BASE_ROUTE,
  PERSONAL_CENTER_BASE_ROUTE
} from '@/common/constants/route';
import { component } from 'vue/types/umd';
import { SESSION_ID_KEY } from '@/common/constants';

const storage = new Storage()


Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/signin',
    component: Signin,
  },
  {
    path: '/compose-viewer',
    meta: {
        requireAuth: true
    },
    redirect: () => {
      const defaultComponent = teacherFunctionList.find(item => item.default);
      return COMPOSE_VIEWER_BASE_ROUTE + defaultComponent?.path
    }, 
    component: ComposeViewer,
    children: teacherFunctionList.map((item): RouteConfig => {
      let res;
      if(item.children) {
        res = {
          path: item.path,
          component: item.component,
          meta: {
            requireAuth: true
        },
          children: item.children.map((child): RouteConfig => {
            return {
              path: child.path,
              component: child.component,
              meta: {
                requireAuth: true
            },
            }
          }),
        }
      } else {
        res = {
          path: item.path,
          component: item.component,
          meta: {
            requireAuth: true
        },
        }
      }
      return res;
    })
  },
  {
    path: '/',
    redirect: '/main',
  },
  {
    path: '/main',
    component: Main,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  console.log(to);
  if(to.meta && to.meta.requireAuth) {
    console.log('需要验证')
    
    const sessionId = storage.get(SESSION_ID_KEY);
    
    
    if(!sessionId) {
      router.push('/signin')
    }
  }
  next();
})

export default router
