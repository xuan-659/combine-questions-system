import AJAX from '@/utlis/ajax';
const $http = new AJAX();

export const send : any={
    async submitTestData(data:any) {
        const res = await $http.post('/question/save', data)
        return res
    },
    async getCourse() {
        var res:any = await $http.get('/course/list')
        return res;
    },
    
}