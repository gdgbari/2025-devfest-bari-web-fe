

import { create } from 'zustand'

export type AppPage = "app" | "verify-email" | "profile" | "add-quiz" | "leaderboard" | "qrscan" | "quiz-info";

type AppRouterStore = {
    currentPage: AppPage,
    navigate: (to:AppPage) => void,
    quizId: string | null,
    navigateToQuiz: (quizId: string) => void,
}

export const useAppRouter = create<AppRouterStore>()((set) => ({
  currentPage: "app",
  navigate: (to:AppPage) => set(() => ({ currentPage: to })),
  quizId: null,
  navigateToQuiz: (quizId: string) => set(() => ({ quizId, currentPage: "quiz-info" })),
}))
