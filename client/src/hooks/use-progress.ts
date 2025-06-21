import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { User, UserProgress, Achievement } from '@shared/schema';

const CURRENT_USER_ID = 1; // In a real app, this would come from auth context

export function useProgress() {
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/user', CURRENT_USER_ID],
  });

  const { data: progress, isLoading: progressLoading } = useQuery<UserProgress[]>({
    queryKey: ['/api/user', CURRENT_USER_ID, 'progress'],
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/user', CURRENT_USER_ID, 'achievements'],
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ topicId, progress }: { topicId: number; progress: number }) => {
      const response = await apiRequest('PUT', `/api/user/${CURRENT_USER_ID}/progress/${topicId}`, { progress });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user', CURRENT_USER_ID, 'progress'] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const response = await apiRequest('PUT', `/api/user/${CURRENT_USER_ID}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user', CURRENT_USER_ID] });
    },
  });

  return {
    user,
    progress,
    achievements,
    isLoading: userLoading || progressLoading || achievementsLoading,
    updateProgress: updateProgressMutation.mutate,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateProgressMutation.isPending || updateUserMutation.isPending,
  };
}
