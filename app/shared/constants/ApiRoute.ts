const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

// Auth route
export const SIGNUP_ROUTE = `${BASE_URL}/api/auth/signup`;
export const SIGNIN_ROUTE = `${BASE_URL}/api/auth/signin`;
export const REFRESH_TOKEN_ROUTE = `${BASE_URL}/api/auth/refresh`;

// User route
export const SEARCH_USER_BY_NAME_ROUTE = `${BASE_URL}/api/user/search/name`;

// Conversation Route
export const CREATE_CONVERSATION_ROUTE = `${BASE_URL}/api/conversation/createConversation`;
export const GET_USER_CONVERSATION_ROUTE = `${BASE_URL}/api/conversation/getUserConversations`;
export const CHECK_CONVERSATION_EXISTS_ROUTE = `${BASE_URL}/api/conversation/checkConversationExists`;
export const GET_CONVERSATION_FILE = `${BASE_URL}/api/conversation/getConversationFile`;
export const UPDATE_CONVERSATION_SETTING_ROUTE = `${BASE_URL}/api/conversation/updateConversationSetting`;
export const GET_CONVERSATION_INFO_ROUTE = `${BASE_URL}/api/conversation/getConversationInfo`;
export const CONVERSATION_ADD_NEW_MEMBER_ROUTE = `${BASE_URL}/api/conversation/addNewMember`;
export const CONVERSATION_REMOVE_MEMBER_ROUTE = `${BASE_URL}/api/conversation/removeMember`;
export const CONVERSATION_PROMOTE_MEMBER_ROUTE = `${BASE_URL}/api/conversation/promoteMember`;
export const CONVERSATION_DOWNGRADE_MEMBER_ROUTE = `${BASE_URL}/api/conversation/downgradeMember`;
export const CONVERSATION_LEFT_GROUP_ROUTE = `${BASE_URL}/api/conversation/leftGroup`;


// Message Route
export const SEND_MESSAGE_ROUTE = `${BASE_URL}/api/message/sendMessage`;
export const UPLOAD_FILE_ATTACH_ROUTE = `${BASE_URL}/api/message/uploadFileAttach`;
export const RECALL_MESSAGE_ROUTE = `${BASE_URL}/api/message/recallMessage`;
export const GET_CONVERSATION_MESSAGES_ROUTE = `${BASE_URL}/api/message/getConversationMessages`;
export const GET_CONVERSATION_OLDER_MESSAGES_ROUTE = `${BASE_URL}/api/message/getOlderMessages`;
export const SEND_VOICE_CLIP_ROUTE = `${BASE_URL}/api/message/sendVoiceClip`;
export const GET_USER_BY_ID_ROUTE = `${BASE_URL}/api/user/getById`;
export const UPDATE_AVATAR_ROUTE = `${BASE_URL}/api/user/updateAvatar`;
