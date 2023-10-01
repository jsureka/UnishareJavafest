import api from "../api";

const UniversityService = {
  getAll: () => {
    return api.getAsync("/universities");
  },

  create: (university) => {
    return api.postAsync("/universities", university);
  },

  update: (university) => {
    return api.putAsync(`/universities/${university.id}`, university);
  },

  getOne: (id) => {
    return api.getAsync(`/universities/${id}`);
  },

  delete: (id) => {
    return api.deleteAsync(`/universities/${id}`);
  },
};

export default UniversityService;
