

import { create } from 'zustand'

export type AppPage = "app" | "verify-email" | "profile" | "add-quiz"

type AppRouterStore = {
    currentPage: AppPage
    navigate: (to:AppPage) => void
}

export const useAppRouter = create<AppRouterStore>()((set) => ({
  currentPage: "app",
  navigate: (to:AppPage) => set(() => ({ currentPage: to })),
}))
