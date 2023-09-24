import api from "../api";

const ProductService = {
  getAll: () => {
    return api.getAsync("/products");
  },

  create: (product) => {
    return api.postAsync("/products", product);
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
};

export default ProductService;
