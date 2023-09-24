import api from "../api";
const CategoryService = {
  getAll: () => {
    return api.getAsync("/category");
  },

  create: (category) => {
    return api.postAsync("/category", category);
  },

  update: (category) => {
    return api.putAsync(`/category/${category.id}`, category);
  },

  getOne: (id) => {
    return api.getAsync(`/category/${id}`);
  },

  delete: (id) => {
    return api.deleteAsync(`/category/${id}`);
  },
};
export default CategoryService;
