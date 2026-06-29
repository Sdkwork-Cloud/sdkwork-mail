pub mod drive_attachment_port;
pub mod mailbox_sync;
pub mod outbound;
pub mod providers;
pub mod service;
pub mod transactional;
pub mod transport_resolver;

pub use drive_attachment_port::build_mail_drive_attachment_port_from_env;
pub use service::MailProductService;
