export const photosRoutes = {
  findMany: '/photos',
  findOne: (id) => `/photos/${id}`,
  create: '/photos',
  update: (id) => `/photos/${id}`,
  delete: (id) => `/photos/${id}`,
  upload: (id) => `/photos/${id}/upload`,
};

export const albumRoutes = {
  findMany: '/albums',
  findOne: (id) => `/albums/${id}`,
  create: '/albums',
  update: (id) => `/albums/${id}`,
  delete: (id) => `/albums/${id}`,
};
