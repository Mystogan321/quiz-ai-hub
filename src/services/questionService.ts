
import api from './api';
import { AIGeneratedQuestion, Question } from '@/types';

export const getAIGeneratedQuestions = async (): Promise<AIGeneratedQuestion[]> => {
  const response = await api.get('/admin/ai-questions');
  return response.data.data;
};

export const generateQuestionsFromContent = async (
  contentId: string,
  count: number = 5
): Promise<{ 
  success: boolean;
  message: string;
  jobId?: string; 
}> => {
  const response = await api.post(`/admin/content/${contentId}/generate-questions`, {
    count
  });
  return response.data;
};

export const approveQuestion = async (questionId: string): Promise<{ success: boolean }> => {
  const response = await api.post(`/admin/ai-questions/${questionId}/approve`);
  return response.data;
};

export const rejectQuestion = async (questionId: string): Promise<{ success: boolean }> => {
  const response = await api.post(`/admin/ai-questions/${questionId}/reject`);
  return response.data;
};

export const editQuestion = async (
  questionId: string, 
  questionData: Partial<Question>
): Promise<Question> => {
  const response = await api.put(`/admin/ai-questions/${questionId}`, questionData);
  return response.data.data;
};

export const getGenerationStatus = async (jobId: string): Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed';
  questions?: AIGeneratedQuestion[];
  message?: string;
}> => {
  const response = await api.get(`/admin/generation-jobs/${jobId}`);
  return response.data;
};
