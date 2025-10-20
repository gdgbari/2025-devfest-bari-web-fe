import type { UserProfile } from "../utils/types"
import { useEffect, useState } from "react"
import { onValue, ref } from "firebase/database"
import { firebase } from "../utils"
import { getMockUsers } from "./AppPage"


type DashboardProps = {
    user: UserProfile
}

const sanitizeInput = (input: string): string => {
    return input
        .replace(/<[^>]*>?/gm, '')
        .substring(0, 100);
}

export const Dashboard = ({ user }: DashboardProps) => {
    const [activeTab, setActiveTab] = useState<'users' | 'quiz' | 'leaderboard'>('users')
    const [query, setQuery] = useState("")
    const [users, setUsers] = useState<UserProfile[]>(() => getMockUsers().map(u => u.data))
    const getBtnClass = (tab: 'users' | 'quiz' | 'leaderboard') => {
        const isActive = activeTab === tab
        const base = "btn w-44 h-12 border rounded-none transition-all duration-200 font-semibold text-base md:text-lg tracking-wide"
        const active = "bg-base-200 border-base-200 text-black ring-2 ring-base-300"
        const inactive = "bg-base-100 border-base-200 text-gray-300 hover:bg-base-200/70 hover:text-gray-100"
        return `${base} ${isActive ? active : inactive}`
    }

    useEffect(() => {
        const unsubscribe = onValue(ref(firebase.database, "users"), (snap) => {
            const val = snap.val() as Record<string, UserProfile> | null
            if (!val) {
                setUsers([])
                return
            }
            const list: UserProfile[] = Object.entries(val).map(([uid, p]) => ({
                uid,
                nickname: p.nickname,
                email: p.email,
                name: p.name,
                surname: p.surname,
                group: p.group,
                role: p.role,
            }))
            setUsers(list)
        })
        return () => unsubscribe()
    }, [])

    return <div className="px-3 sm:px-4 md:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
            Benvenuto/a {user.name} {user.surname} <span className="text-xl sm:text-2xl md:text-3xl text-gray-300"></span>
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">Ruolo: {user.role}</h2>

        <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 md:gap-8 justify-center w-full">
            {/* Pulsante Utenti */}
            <button
                type="button"
                aria-pressed={activeTab === 'users'}
                className={getBtnClass('users')}
                onClick={() => setActiveTab('users')}
            >
                Utenti
            </button>

            {/* Pulsante Quiz */}
            <button
                type="button"
                aria-pressed={activeTab === 'quiz'}
                className={getBtnClass('quiz')}
                onClick={() => setActiveTab('quiz')}
            >
                Quiz
            </button>

            {/* Pulsante Leaderboard */}
            <button
                type="button"
                aria-pressed={activeTab === 'leaderboard'}
                className={getBtnClass('leaderboard')}
                onClick={() => setActiveTab('leaderboard')}
            >
                Leaderboard
            </button>
        </div>
        {/* Barra di ricerca */}
        <div className="mt-6 w-full flex justify-center px-2 sm:px-0">
            <div className="w-full max-w-2xl relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg 
                        className="h-5 w-5 text-gray-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        const sanitizedValue = sanitizeInput(e.target.value);
                        setQuery(sanitizedValue);
                    }}
                    placeholder="Cerca"
                    className="pl-10 input input-bordered w-full rounded-none bg-base-100 border-base-200 text-gray-200 placeholder:text-gray-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                />
            </div>
        </div>
        {/* Tabella utenti */}
        <div className="mt-6 w-full flex justify-center">
            <div className="w-full max-w-3xl flex flex-col gap-4">
                {users
                    .filter(u => {
                        const q = query.trim().toLowerCase()
                        if (!q) return true
                        return (
                            u.name.toLowerCase().includes(q) ||
                            u.surname.toLowerCase().includes(q) ||
                            u.email.toLowerCase().includes(q) ||
                            u.nickname.toLowerCase().includes(q) ||
                            u.uid.toLowerCase().includes(q)
                        )
                    })
                    .map(u => (
                        <div key={u.uid} className="relative w-full bg-base-100 border border-base-200 p-3 sm:p-4 md:p-5 rounded-none hover:bg-base-100/80 transition-colors">
                            <div className="flex flex-col gap-1 sm:gap-2 text-gray-100 items-start text-left pr-10">
                                <div className="text-sm sm:text-base">
                                    <span className="font-semibold">Nome e Cognome: </span>
                                    <span>{u.name} {u.surname}</span>
                                </div>
                                <div className="text-sm sm:text-base">
                                    <span className="font-semibold">Email: </span>
                                    <span className="break-all">{u.email}</span>
                                </div>
                                <div className="text-sm sm:text-base">
                                    <span className="font-semibold">Nickname: </span>
                                    <span>{u.nickname}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                aria-label="Aggiungi"
                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 btn btn-sm w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 min-h-0 p-0 rounded-sm bg-base-200 hover:bg-base-300 border-base-200 text-black text-lg flex items-center justify-center"
                            >
                                +
                            </button>
                            <div className="absolute right-2 sm:right-3 bottom-2 text-[10px] sm:text-xs text-gray-500">ID: {u.uid}</div>
                        </div>
                    ))}
            </div>
        </div>
    </div>

}