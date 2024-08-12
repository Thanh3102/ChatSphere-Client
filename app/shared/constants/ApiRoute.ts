const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export const SIGNUP_ROUTE = `${BASE_URL}/api/auth/signup`;
export const SIGNIN_ROUTE = `${BASE_URL}/api/auth/signin`;
export const REFRESH_TOKEN_ROUTE = `${BASE_URL}/api/auth/refresh`;

export const SEARCH_USER_BY_NAME_ROUTE = `${BASE_URL}/api/user/search/name`;

export const CREATE_CONVERSATION_ROUTE = `${BASE_URL}/api/message/createConversation`;
export const SEND_MESSAGE_ROUTE = `${BASE_URL}/api/message/sendMessage`;
export const UPLOAD_FILE_ATTACH_ROUTE = `${BASE_URL}/api/message/uploadFileAttach`;
export const RECALL_MESSAGE_ROUTE = `${BASE_URL}/api/message/recallMessage`
export const GET_USER_CONVERSATION_ROUTE = `${BASE_URL}/api/message/getConversation`;
export const GET_CONVERSATION_INFO_ROUTE = `${BASE_URL}/api/message/getConversationInfo`;
export const GET_CONVERSATION_MESSAGES_ROUTE = `${BASE_URL}/api/message/getConversationMessages`;
export const GET_CONVERSATION_OLDER_MESSAGES_ROUTE = `${BASE_URL}/api/message/getOlderMessages`;
export const GET_CONVERSATION_MEDIA_FILE = `${BASE_URL}/api/message/getConversationMediaFile`;

export const CHECK_CONVERSATION_EXISTS_ROUTE = `${BASE_URL}/api/message/checkConversationExists`;

export const GET_USER_BY_ID_ROUTE = `${BASE_URL}/api/user/getById`;
export const UPDATE_AVATAR_ROUTE = `${BASE_URL}/api/user/updateAvatar`;


