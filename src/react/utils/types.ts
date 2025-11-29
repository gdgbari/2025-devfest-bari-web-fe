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
    role: Role,
    checked_in: boolean
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

export type UpdateQuestionSchema = {
    text: string
    answer_list: AnswerSchema[]
    correct_answer: string
    question_id?: string | null
}

export type QuestionSchema = {
    text: string
    answer_list: AnswerSchema[]
    correct_answer: string
    value?: number | null
    question_id?: string | null
}

export type ReadAnswerSchema = {
    id: string
    text: string
}

export type ReadQuestionSchema = {
    text: string
    answer_list: ReadAnswerSchema[]
    value?: number
    question_id?: string | null
}

export type ReadQuestionWithCorrectSchema = {
    text: string
    answer_list: ReadAnswerSchema[]
    correct_answer: string
    value?: number
    question_id?: string | null
}

export type GetUserResponse = {
    email: string
    name: string
    surname: string
    nickname: string
    uid: string
    group?: GetGroupResponse | null
    tags?: {
        points: number
        tag_id: string
    }[]
    checked_in: boolean
    role?: Role
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
    role: Role
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
    role?: Role | null
}

export type UpdateUserResponse = GetUserResponse

export type CheckInResponse = GetUserResponse

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
    session_id: string
}

export type GetQuizWithCorrectResponse = {
    quiz_id: string
    title: string
    question_list: ReadQuestionWithCorrectSchema[]
    is_open: boolean
    timer_duration: number
    session_id: string
}

export type GetQuizListWithCorrectResponse = {
    quizzes: GetQuizWithCorrectResponse[]
    total: number
}

export type CreateQuizRequest = {
    title: string
    question_list: QuestionSchema[]
    session_id: string
}

export type CreateQuizResponse = GetQuizResponse

export type UpdateQuizRequest = {
    title?: string | null
    question_list?: UpdateQuestionSchema[] | null
    is_open?: boolean | null
    session_id?: string | null
}

export type UpdateQuizResponse = GetQuizResponse

export type SubmitQuizRequest = {
    answer_list: string[]
}

export type SubmitQuizResponse = {
    score: number
    max_score: number
}

export type QuizResult = {
    score: number
    max_score: number
    quiz_title: string
    submitted_at: number
}

export type UserQuizResultListResponse = {
    results: QuizResult[]
}


// ========================
// Tag Types
// ========================

export interface GetTagResponse {
    tag_id: string
    points: number
    secret: string
}

export type GetTagListResponse = {
    tags: GetTagResponse[]
    total: number
}

export interface CreateTagRequest {
    tag_id: string
    points: number
}

export type CreateTagResponse = GetTagResponse

export interface UpdateTagRequest {
    points?: number | null
}

export type UpdateTagResponse = GetTagResponse

// Tag Assignment Types
export interface AssignTagRequest {
    tag_id: string
    uid: string
}

export interface AssignTagResponse {
    tag_id: string
    user_id: string
    points: number
}

export interface AssignTagBySecretRequest {
    secret: string
}

export interface AssignTagBySecretResponse {
    secret: string
    user_id: string
    points: number
}

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

// ========================
// Remote Config Types
// ========================

export type RemoteConfig = {
    check_in_open: boolean
    draw_open: boolean
    draw_time: Date
    info_content: string
    info_title: string
    leaderboard_open: boolean
    quiz_points: number
    time_per_question: number
    winner_room: string
    winner_time: string
}
