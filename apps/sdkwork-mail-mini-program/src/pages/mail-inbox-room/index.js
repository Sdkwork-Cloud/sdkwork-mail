const { SESSION_STORAGE_KEY } = require("../../constants/sessionStorageKey");
const { bootstrapMailMiniProgram, getMailMessage } = require("../../runtime/mail-app");

Page({
  data: {
    messageId: "",
    message: null,
    loading: true,
    error: "",
  },
  onLoad(options) {
    const messageId = String(options.messageId || options.sessionId || "").trim();
    if (!messageId) {
      this.setData({ loading: false, error: "Missing message id" });
      return;
    }
    const raw = wx.getStorageSync(SESSION_STORAGE_KEY);
    if (!raw) {
      wx.reLaunch({ url: "/pages/login/index" });
      return;
    }
    try {
      JSON.parse(raw);
      bootstrapMailMiniProgram();
      this.setData({ messageId });
      this.loadMessage();
    } catch {
      wx.reLaunch({ url: "/pages/login/index" });
    }
  },
  async loadMessage() {
    this.setData({ loading: true, error: "" });
    try {
      const message = await getMailMessage(this.data.messageId);
      this.setData({ message, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load message";
      this.setData({ loading: false, error: message });
    }
  },
});
