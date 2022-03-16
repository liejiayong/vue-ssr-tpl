import request from '@/utils/request.js';

export const getTopics = () => {
  return request.get('/topics');
};
