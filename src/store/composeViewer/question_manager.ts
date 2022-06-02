import AJAX from '@/utlis/ajax';
const $http = new AJAX();

export const manager: any={
    async getQuestionlist(data:any) {
        const {courseId,questionType,pageNumber,pageSize}=data
        var res:any = await $http.get('/question/list',data)
        return res;
    },

    async stop(data:any) {
        var arr={
            questionId:data
        }
        var res:any = await $http.post('/question/stop',arr)
    },
    async open(data:any) {
        var arr={
            questionId:data
        }
        var res:any = await $http.post('/question/start',data)
    },
    
}