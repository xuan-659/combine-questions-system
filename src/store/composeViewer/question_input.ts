import AJAX from "@/utlis/ajax";
const $http = new AJAX();

export const send: any = {
  async submitTestData(data: any) {
    const res = await $http.post("/question/save", data);
    return res;
  },
  async getCourse() {
    var res: any = await $http.get("/course/list");
    return res;
  },
  async getKnowledgePoint(courseId: number) {
    let {
      data: { data },
    } = await $http.get("/knowledge/listByCourseId", {
      courseId,
    });
    console.log(data);
    return data;
  },
  async getAbilityPoint(courseId: number) {
    let {
      data: { data },
    } = await $http.get("/ability/listByCourseId", {
      courseId,
    });
    console.log(data);
    return data;
  },
};
