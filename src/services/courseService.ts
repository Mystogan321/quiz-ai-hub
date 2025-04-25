
import api from './api';
import { Course, Module, ContentItem } from '@/types';

export const getCourses = async (): Promise<Course[]> => {
  const response = await api.get('/courses');
  return response.data.data;
};

export const getCourse = async (id: string): Promise<Course> => {
  const response = await api.get(`/courses/${id}`);
  return response.data.data;
};

export const getModule = async (courseId: string, moduleId: string): Promise<Module> => {
  const response = await api.get(`/courses/${courseId}/modules/${moduleId}`);
  return response.data.data;
};

export const getContentItem = async (
  courseId: string, 
  moduleId: string,
  contentId: string
): Promise<ContentItem> => {
  const response = await api.get(`/courses/${courseId}/modules/${moduleId}/content/${contentId}`);
  return response.data.data;
};

export const markContentCompleted = async (
  courseId: string, 
  moduleId: string,
  contentId: string
): Promise<{ success: boolean }> => {
  const response = await api.post(`/courses/${courseId}/modules/${moduleId}/content/${contentId}/complete`);
  return response.data;
};

export const getCourseProgress = async (courseId: string): Promise<number> => {
  const response = await api.get(`/courses/${courseId}/progress`);
  return response.data.progress;
};
