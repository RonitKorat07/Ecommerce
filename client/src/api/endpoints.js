const API = {
  auth: {
    signin: '/signin',
    signup: '/signup',
  },
  product: {
    all: '/product',
    add: '/product/add',
    delete: (id) => `/product/delete/${id}`,
    update: (id) => `/product/update/${id}`,
    getById: (id) => `/product/${id}`,
    filter: (category, exclude) => `/products/filter?category=${category}&exclude=${exclude}`,
  },
  category: {
    all: '/category',
    add: '/category/add',
    delete: (id) => `/category/delete/${id}`,
    update: (id) => `/category/update/${id}`,
  },
  cart: {
    add: '/cart/add',
    get: (userId) => `/cart/${userId}`,
    remove: (userId, itemId) => `/cart/remove/${userId}/${itemId}`,
    update: (userId) => `/cart/update/${userId}`,
    checkoutSummary: '/cart/checkoutsummary',
  },
  order: {
    place: '/order/placeorder',
    adminAll: (pageNum) => `/order/admin/all?page=${pageNum}`,
    userOrders: (userId) => `/order/user/${userId}`,
  },
  search: (query) => `/search?q=${encodeURIComponent(query)}`,
};

export default API;
