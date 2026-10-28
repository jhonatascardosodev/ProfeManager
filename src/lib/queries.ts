import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  changePassword,
  createClassroom,
  createGrade,
  createLessonPlan,
  deleteClassroom,
  deleteGrade,
  deleteLessonPlan,
  fetchMe,
  listClassrooms,
  listGrades,
  listLessonPlans,
  updateClassroom,
  updateGrade,
  updateLessonPlan,
  updateProfile,
} from './api'

export const queryKeys = {
  classrooms: ['classrooms'] as const,
  lessonPlans: ['lesson-plans'] as const,
  grades: ['grades'] as const,
  me: ['me'] as const,
}

type CreateGradePayload = Parameters<typeof createGrade>[0]
type UpdateGradePayload = Parameters<typeof updateGrade>[1]
type CreateLessonPlanPayload = Parameters<typeof createLessonPlan>[0]
type UpdateLessonPlanPayload = Parameters<typeof updateLessonPlan>[1]
type CreateClassroomPayload = Parameters<typeof createClassroom>[0]
type UpdateClassroomPayload = Parameters<typeof updateClassroom>[1]

/** Mutation que invalida a lista `key` quando conclui com sucesso. */
function useInvalidatingMutation<TVars, TData>(
  key: readonly string[],
  mutationFn: (vars: TVars) => Promise<TData>,
) {
  const client = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  })
}

// --- Notas ---

export const useGradesQuery = () =>
  useQuery({ queryKey: queryKeys.grades, queryFn: () => listGrades() })

export const useCreateGrade = () =>
  useInvalidatingMutation(queryKeys.grades, (payload: CreateGradePayload) => createGrade(payload))

export const useUpdateGrade = () =>
  useInvalidatingMutation(queryKeys.grades, (v: { id: number; payload: UpdateGradePayload }) =>
    updateGrade(v.id, v.payload),
  )

export const useDeleteGrade = () =>
  useInvalidatingMutation(queryKeys.grades, (id: number) => deleteGrade(id))

// --- Planejamentos ---

export const useLessonPlansQuery = () =>
  useQuery({ queryKey: queryKeys.lessonPlans, queryFn: listLessonPlans })

export const useCreateLessonPlan = () =>
  useInvalidatingMutation(queryKeys.lessonPlans, (payload: CreateLessonPlanPayload) =>
    createLessonPlan(payload),
  )

export const useUpdateLessonPlan = () =>
  useInvalidatingMutation(
    queryKeys.lessonPlans,
    (v: { id: number; payload: UpdateLessonPlanPayload }) => updateLessonPlan(v.id, v.payload),
  )

export const useDeleteLessonPlan = () =>
  useInvalidatingMutation(queryKeys.lessonPlans, (id: number) => deleteLessonPlan(id))

// --- Mapas de sala ---

export const useClassroomsQuery = () =>
  useQuery({ queryKey: queryKeys.classrooms, queryFn: listClassrooms })

export const useCreateClassroom = () =>
  useInvalidatingMutation(queryKeys.classrooms, (payload: CreateClassroomPayload) =>
    createClassroom(payload),
  )

export const useUpdateClassroom = () =>
  useInvalidatingMutation(
    queryKeys.classrooms,
    (v: { id: number; payload: UpdateClassroomPayload }) => updateClassroom(v.id, v.payload),
  )

export const useDeleteClassroom = () =>
  useInvalidatingMutation(queryKeys.classrooms, (id: number) => deleteClassroom(id))

// --- Perfil ---

export const useMeQuery = () => useQuery({ queryKey: queryKeys.me, queryFn: fetchMe })

export const useUpdateProfile = () =>
  useInvalidatingMutation(queryKeys.me, (payload: Parameters<typeof updateProfile>[0]) =>
    updateProfile(payload),
  )

export const useChangePassword = () =>
  useMutation({
    mutationFn: (v: { currentPassword: string; newPassword: string }) =>
      changePassword(v.currentPassword, v.newPassword),
  })
