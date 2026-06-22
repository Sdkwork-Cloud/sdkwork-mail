pub mod capability_catalog;
pub mod data_source;
pub mod driver_manager;
pub mod language_workspace_catalog;
pub mod provider_activation_catalog;
pub mod provider_catalog;
pub mod provider_package_catalog;
pub mod provider_package_loader;
pub mod provider_extension_catalog;
pub mod provider_selection;
pub mod provider_support;

pub struct MailStandardContract;

pub trait MailProviderDriver<TNativeClient> {
    fn provider_key(&self) -> &str;
}

pub trait MailDriverManager<TNativeClient> {
    fn resolve_driver(&self, provider_key: &str);
}

pub trait MailDataSource<TNativeClient> {
    fn create_client(&self);
}

pub trait MailClient<TNativeClient> {
    fn connect_transport(&self);
    fn authenticate_transport(&self);
    fn disconnect_transport(&self);
    fn send_mail(&self);
    fn probe_mailbox(&self);
    fn sync_mailbox(&self);
    fn health_check(&self);
    fn unwrap(&self) -> Option<&TNativeClient>;
}

pub trait MailRuntimeController<TNativeClient> {
    fn connect_transport(&self);
    fn authenticate_transport(&self);
    fn disconnect_transport(&self);
    fn send_mail(&self);
    fn probe_mailbox(&self);
    fn sync_mailbox(&self);
    fn health_check(&self);
}
