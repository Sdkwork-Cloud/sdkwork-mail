const { SESSION_STORAGE_KEY } = require("../../constants/sessionStorageKey");
const {
  bootstrapMailMiniProgram,
  listMailAccounts,
  listMailFolders,
  listMailMessages,
} = require("../../runtime/mail-app");

Page({
  data: {
    userId: "user",
    accounts: [],
    folders: [],
    messages: [],
    selectedAccountId: "",
    selectedFolderId: "",
    loading: false,
    error: "",
  },
  onShow() {
    const raw = wx.getStorageSync(SESSION_STORAGE_KEY);
    if (!raw) {
      wx.reLaunch({ url: "/pages/login/index" });
      return;
    }
    try {
      const session = JSON.parse(raw);
      this.setData({ userId: session.userId || "user" });
      bootstrapMailMiniProgram();
      this.loadInbox();
    } catch {
      wx.reLaunch({ url: "/pages/login/index" });
    }
  },
  onSignOut() {
    wx.removeStorageSync(SESSION_STORAGE_KEY);
    wx.reLaunch({ url: "/pages/login/index" });
  },
  async loadInbox() {
    this.setData({ loading: true, error: "" });
    try {
      const accounts = await listMailAccounts();
      const selectedAccountId = accounts[0]?.id || "";
      const folders = selectedAccountId ? await listMailFolders(selectedAccountId) : [];
      const selectedFolderId = folders[0]?.id || "";
      const messages = selectedFolderId ? await listMailMessages(selectedFolderId) : [];
      this.setData({
        accounts,
        folders,
        messages,
        selectedAccountId,
        selectedFolderId,
        loading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load inbox";
      this.setData({ loading: false, error: message });
      wx.showToast({ title: message, icon: "none" });
    }
  },
  async onAccountChange(event) {
    const index = Number(event.detail.value);
    const account = this.data.accounts[index];
    if (!account?.id) {
      return;
    }
    this.setData({ loading: true, error: "" });
    try {
      const folders = await listMailFolders(account.id);
      const selectedFolderId = folders[0]?.id || "";
      const messages = selectedFolderId ? await listMailMessages(selectedFolderId) : [];
      this.setData({
        selectedAccountId: account.id,
        folders,
        selectedFolderId,
        messages,
        loading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load folders";
      this.setData({ loading: false, error: message });
    }
  },
  async onFolderTap(event) {
    const folderId = event.currentTarget.dataset.id;
    if (!folderId) {
      return;
    }
    this.setData({ loading: true, error: "", selectedFolderId: folderId });
    try {
      const messages = await listMailMessages(folderId);
      this.setData({ messages, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load messages";
      this.setData({ loading: false, error: message });
    }
  },
  onRefresh() {
    this.loadInbox();
  },
  onOpenMessage(event) {
    const messageId = event.currentTarget.dataset.id;
    if (!messageId) {
      return;
    }
    wx.navigateTo({
      url: `/pages/mail-inbox-room/index?messageId=${encodeURIComponent(messageId)}`,
    });
  },
});
