export type LeaderBoardUser = {
    nickname: string,
    score: number,
    groupColor: string,
    timestamp: number,
}

export type LeaderBoardGroup = {
    name: string,
    score: number,
    timestamp: number,
    color: string
}

export type LeaderBoardData = {
    users: {
        [uid: string]: LeaderBoardUser
    },
    groups: {
        [gid: string]: LeaderBoardGroup
    }
}

export const QUIZ_TYPES = ["talk", "sponsor", "special", "hidden", "custom"] as const

export type QuizType = typeof QUIZ_TYPES[number]

export enum Role {
    ADMIN = "admin",
    STAFF = "staff",
    SPEAKER = "speaker",
    ATTENDEE = "attendee",
}

export type Quiz = {
    quizId: string,
    creatorUid: string,
    isOpen: boolean,
    maxScore: string,
    questionList: Question[],
    title: string,
    timerDuration: number,
    talkId: string,
    sponsorId: string,
    type: QuizType,
}

export type Question = {
    questionId: string,
    text: string,
    correctAnswer: string | null,
    value: number | null,
    answerList: Answer[],
}

export type Answer = {
    id: string,
    text: string,
}
export type UserProfile = {
    uid: string,
    nickname: string,
    email: string,
    name: string,
    surname: string,
    group: string,
    role: Role
}

export type AddPointRequest = {
    title: string,
    value: number,
    userIdList: string[]
}
