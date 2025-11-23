export type LeaderBoardUser = {
    nickname: string,
    score: number,
    group_color: string,
    updated_at: number,
}

export type LeaderBoardGroup = {
    name: string,
    score: number,
    updated_at: number,
    color: string
}

export type LeaderBoardData = {
    leaderboard_users: {
        [uid: string]: LeaderBoardUser
    },
    leaderboard_groups: {
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
    group?: GetGroupResponse | null,
    role: Role
}

export type AddPointRequest = {
    title: string,
    value: number,
    userIdList: string[]
}

// ========================
// Backend API Types (from OpenAPI)
// ========================

export type AnswerSchema = {
    id: string
    text: string
}

export type QuestionSchema = {
    text: string
    answer_list: AnswerSchema[]
    correct_answer: string
    value?: number
}

export type ReadAnswerSchema = {
    id: string
    text: string
}

export type ReadQuestionSchema = {
    text: string
    answer_list: ReadAnswerSchema[]
    value?: number
}

export type ReadQuestionWithCorrectSchema = {
    text: string
    answer_list: ReadAnswerSchema[]
    correct_answer: string
    value?: number
}

export type GetUserResponse = {
    email: string
    name: string
    surname: string
    nickname: string
    uid: string
    group?: GetGroupResponse | null
}

export type GetUserListResponse = {
    users: GetUserResponse[]
    total: number
}

export type CreateUserRequest = {
    email: string
    name: string
    surname: string
    nickname: string
    password: string
}

export type CreateUserResponse = {
    email: string
    name: string
    surname: string
    nickname: string
    uid: string
}

export type UpdateUserRequest = {
    email?: string | null
    name?: string | null
    surname?: string | null
}

export type UpdateUserResponse = GetUserResponse

export type CheckInResponse = {
    group: GetGroupResponse
}

export type GetGroupResponse = {
    name: string
    color: string
    image_url: string
    user_count: number
    gid: string
}

export type GetGroupListResponse = {
    groups: GetGroupResponse[]
    total: number
}

export type CreateGroupRequest = {
    name: string
    color: string
    image_url: string
    user_count: number
}

export type CreateGroupResponse = GetGroupResponse

export type UpdateGroupRequest = {
    name?: string | null
    color?: string | null
    image_url?: string | null
}

export type UpdateGroupResponse = GetGroupResponse

export type GetQuizResponse = {
    quiz_id: string
    title: string
    question_list: ReadQuestionSchema[]
    timer_duration: number
}

export type GetQuizWithCorrectResponse = {
    quiz_id: string
    title: string
    question_list: ReadQuestionWithCorrectSchema[]
    is_open: boolean
    timer_duration: number
}

export type GetQuizListWithCorrectResponse = {
    quizzes: GetQuizWithCorrectResponse[]
    total: number
}

export type CreateQuizRequest = {
    title: string
    question_list: QuestionSchema[]
}

export type CreateQuizResponse = {
    title: string
    question_list: QuestionSchema[]
    quiz_id: string
    is_open: boolean
    timer_duration: number
}

export type UpdateQuizRequest = {
    title?: string | null
    question_list?: QuestionSchema[] | null
    is_open?: boolean | null
}

export type UpdateQuizResponse = CreateQuizResponse

export type SubmitQuizRequest = {
    answer_list: string[]
}

export type SubmitQuizResponse = {
    score: number
    max_score: number
}


// ========================
// Tag Types
// ========================

export type GetTagResponse = {
    points: number
    tag_id: string
}

export type GetTagListResponse = {
    tags: GetTagResponse[]
    total: number
}

export type CreateTagRequest = {
    points: number
    tag_id?: string | null
}

export type CreateTagResponse = GetTagResponse

export type UpdateTagRequest = {
    points?: number | null
}

export type UpdateTagResponse = GetTagResponse

// ========================
// Sessionize Types
// ========================

export type SessionizeSession = {
    id: string
    title: string
    description: string
    startsAt: string
    endsAt: string
    isServiceSession: boolean
    isPlenumSession: boolean
    speakers: {
        id: string
        name: string
    }[]
    roomId: number
    room: string
}

export type SessionizeSpeaker = {
    id: string
    firstName: string
    lastName: string
    fullName: string
    bio: string
    tagLine: string
    profilePicture: string
    sessions: {
        id: number
        name: string
    }[]
    links: {
        title: string
        url: string
        linkType: string
    }[]
}

export type SessionizeGridSmart = any // The structure can be complex, using any for now as per request "acquisition"

export type SessionizeSpeakerWall = any
