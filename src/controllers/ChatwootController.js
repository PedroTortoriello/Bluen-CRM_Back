// controllers/ChatwootController.js
import axios from "axios";

const CHATWOOT_BASE_URL = "https://chatwoot.iabluen.com.br";
const CHATWOOT_ACCOUNT_ID = "1";
const CHATWOOT_API_TOKEN = "ufE9Sr1x5xdQjWvpNCbKVkTM";

const api = axios.create({
  baseURL: `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}`,
  headers: {
    api_access_token: CHATWOOT_API_TOKEN,
    "Content-Type": "application/json",
  },
});

export const ChatwootController = {
  api, // <- exporta o axios para uso direto em rotas

  getInboxes: async () => {
    const response = await api.get("/inboxes");
    return response.data;
  },

  getConversations: async (inboxId) => {
    const url = inboxId ? `/conversations?inbox_id=${inboxId}` : "/conversations";
    const response = await api.get(url);
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (conversationId, content, message_type = 1) => {
    const response = await api.post(`/conversations/${conversationId}/messages`, {
      content,
      message_type,
    });
    return response.data;
  },

  updateConversation: async (conversationId, data) => {
    const response = await api.patch(`/conversations/${conversationId}`, data);
    return response.data;
  },

  assignConversation: async (conversationId, assignee_id) => {
    const response = await api.post(`/conversations/${conversationId}/assignments`, { assignee_id });
    return response.data;
  },
};
