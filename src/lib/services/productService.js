import api from "../api";

const ProductService = {
  getAll: () => {
    return api.getAsync("/products");
  },

  getAllByCategory: (category) => {
    return api.getAsync(`/products/category/${category}`);
  },

  create: (product) => {
    return api.postFormAsync("/products", product);
  },

  update: (product) => {
    return api.putAsync(`/products/${product.id}`, product);
  },

  getOne: (id) => {
    return api.getAsync(`/products/${id}`);
  },

  delete: (id) => {
    return api.deleteAsync(`/productss/${id}`);
  },

  getByUser: (id, page, size) => {
    return api.getAsync(`/products/owner/${id}?page=${page}&size=${size}`);
  },
  restrict: (id) => {
    return api.postAsync(`/products/restricted/${id}`);
  },
};

export default ProductService;
