/**
 * "Back to chat" on a case study returns to the conversation as it was left.
 * The portfolio saves its chat under CHAT_STATE_KEY whenever the page is left;
 * the Back link sets RESUME_KEY so the portfolio restores it instead of starting fresh.
 * Both live in sessionStorage, so they belong to one browser tab.
 */
export const CHAT_STATE_KEY = 'portfolio:chat'
export const RESUME_KEY = 'portfolio:resume'
