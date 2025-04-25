
import api from './api';
import { Assessment } from '@/types';

export const getAssessments = async (): Promise<Assessment[]> => {
  const response = await api.get('/assessments');
  return response.data.data;
};

export const getAssessment = async (id: string): Promise<Assessment> => {
  const response = await api.get(`/assessments/${id}`);
  return response.data.data;
};

export const submitAssessment = async (
  assessmentId: string,
  answers: Record<string, string | number>,
  events?: string[]
): Promise<{ 
  score: number;
  completed: boolean;
  feedback?: string;
}> => {
  const response = await api.post(`/assessments/${assessmentId}/submit`, {
    answers,
    events
  });
  return response.data;
};

export const getModuleAssessments = async (
  courseId: string,
  moduleId: string
): Promise<Assessment[]> => {
  const response = await api.get(`/courses/${courseId}/modules/${moduleId}/assessments`);
  return response.data.data;
};
