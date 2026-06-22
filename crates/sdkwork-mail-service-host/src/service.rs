use std::sync::Arc;

use sdkwork_communication_mail_service::{
    CreateMailMessageRequest, MailAccount, MailFolder, MailListWindowParams, MailMessage,
    MailPersistenceError, MailPersistencePort, MailProviderAccount, MailThread,
    NoopMailPersistencePort, UpdateMailMessageRequest, apply_list_window,
};
use sdkwork_router_mail_app_api::service::{
    MailAppApiError, MailAppApiFuture, MailAppApiService, MailListData, MailListRequest,
};
use sdkwork_router_mail_backend_api::service::{
    MailBackendApiError, MailBackendApiFuture, MailBackendApiService, MailBackendListData,
    MailBackendListRequest,
};

#[derive(Clone)]
pub struct MailProductService {
    persistence: Arc<dyn MailPersistencePort>,
}

impl MailProductService {
    pub fn new() -> Self {
        Self {
            persistence: Arc::new(NoopMailPersistencePort),
        }
    }

    pub fn with_persistence(mut self, persistence: Arc<dyn MailPersistencePort>) -> Self {
        self.persistence = persistence;
        self
    }
}

impl Default for MailProductService {
    fn default() -> Self {
        Self::new()
    }
}

impl MailAppApiService for MailProductService {
    fn list_accounts(
        &self,
        request: MailListRequest,
    ) -> MailAppApiFuture<MailListData<MailAccount>> {
        let persistence = self.persistence.clone();
        Box::pin(async move {
            let organization_id = organization_id_or_zero(&request.organization_id);
            let items = persistence
                .list_accounts(&request.tenant_id, &organization_id, &request.owner_user_id)
                .await
                .map_err(map_persistence_error)?;
            Ok(window(items, &request))
        })
    }

    fn list_folders(&self, request: MailListRequest) -> MailAppApiFuture<MailListData<MailFolder>> {
        let persistence = self.persistence.clone();
        Box::pin(async move {
            let account_id = request
                .account_id
                .clone()
                .ok_or_else(|| MailAppApiError::BadRequest("accountId is required".to_owned()))?;
            let organization_id = organization_id_or_zero(&request.organization_id);
            let items = persistence
                .list_folders(&request.tenant_id, &organization_id, &account_id)
                .await
                .map_err(map_persistence_error)?;
            Ok(window(items, &request))
        })
    }

    fn list_threads(&self, request: MailListRequest) -> MailAppApiFuture<MailListData<MailThread>> {
        let persistence = self.persistence.clone();
        Box::pin(async move {
            let folder_id = request
                .folder_id
                .clone()
                .ok_or_else(|| MailAppApiError::BadRequest("folderId is required".to_owned()))?;
            let organization_id = organization_id_or_zero(&request.organization_id);
            let items = persistence
                .list_threads(&request.tenant_id, &organization_id, &folder_id)
                .await
                .map_err(map_persistence_error)?;
            Ok(window(items, &request))
        })
    }

    fn list_messages(
        &self,
        request: MailListRequest,
    ) -> MailAppApiFuture<MailListData<MailMessage>> {
        let persistence = self.persistence.clone();
        Box::pin(async move {
            let folder_id = request
                .folder_id
                .clone()
                .ok_or_else(|| MailAppApiError::BadRequest("folderId is required".to_owned()))?;
            let organization_id = organization_id_or_zero(&request.organization_id);
            let items = persistence
                .list_messages(&request.tenant_id, &organization_id, &folder_id)
                .await
                .map_err(map_persistence_error)?;
            Ok(window(items, &request))
        })
    }

    fn retrieve_message(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        message_id: String,
    ) -> MailAppApiFuture<MailMessage> {
        let persistence = self.persistence.clone();
        Box::pin(async move {
            persistence
                .retrieve_message(
                    &tenant_id,
                    &organization_id_or_zero(&organization_id),
                    &message_id,
                )
                .await
                .map_err(map_persistence_error)
        })
    }

    fn create_message(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        owner_user_id: String,
        request: CreateMailMessageRequest,
    ) -> MailAppApiFuture<MailMessage> {
        let persistence = self.persistence.clone();
        Box::pin(async move {
            persistence
                .create_message(
                    &tenant_id,
                    &organization_id_or_zero(&organization_id),
                    &owner_user_id,
                    request,
                )
                .await
                .map_err(map_persistence_error)
        })
    }

    fn update_message(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        message_id: String,
        request: UpdateMailMessageRequest,
    ) -> MailAppApiFuture<MailMessage> {
        let persistence = self.persistence.clone();
        Box::pin(async move {
            persistence
                .update_message(
                    &tenant_id,
                    &organization_id_or_zero(&organization_id),
                    &message_id,
                    request,
                )
                .await
                .map_err(map_persistence_error)
        })
    }

    fn delete_message(
        &self,
        tenant_id: String,
        organization_id: Option<String>,
        message_id: String,
    ) -> MailAppApiFuture<()> {
        let persistence = self.persistence.clone();
        Box::pin(async move {
            persistence
                .delete_message(
                    &tenant_id,
                    &organization_id_or_zero(&organization_id),
                    &message_id,
                )
                .await
                .map_err(map_persistence_error)
        })
    }
}

impl MailBackendApiService for MailProductService {
    fn list_provider_accounts(
        &self,
        request: MailBackendListRequest,
    ) -> MailBackendApiFuture<MailBackendListData<MailProviderAccount>> {
        let persistence = self.persistence.clone();
        Box::pin(async move {
            let organization_id = organization_id_or_zero(&request.organization_id);
            let items = persistence
                .list_provider_accounts(&request.tenant_id, &organization_id)
                .await
                .map_err(map_backend_persistence_error)?;
            Ok(MailBackendListData {
                items,
                next_cursor: None,
            })
        })
    }
}

fn organization_id_or_zero(organization_id: &Option<String>) -> String {
    organization_id
        .clone()
        .filter(|value| !value.trim().is_empty())
        .unwrap_or_else(|| "0".to_owned())
}

fn window<T>(items: Vec<T>, request: &MailListRequest) -> MailListData<T>
where
    T: Clone,
{
    let params = MailListWindowParams {
        page: request.page,
        page_size: request.page_size,
        cursor: request.cursor.clone(),
        limit: None,
        q: request.q.clone(),
        sort: request.sort.clone(),
    };
    let windowed = apply_list_window(items, &params, |_| Vec::new(), |_, _| String::new())
        .unwrap_or_else(|_| sdkwork_communication_mail_service::MailListWindow {
            items: Vec::new(),
            next_cursor: None,
        });
    MailListData {
        items: windowed.items,
        next_cursor: windowed.next_cursor,
    }
}

fn map_persistence_error(error: MailPersistenceError) -> MailAppApiError {
    match error {
        MailPersistenceError::NotFound(message) => MailAppApiError::NotFound(message),
        MailPersistenceError::Conflict(message) => MailAppApiError::Conflict(message),
        MailPersistenceError::Unavailable(message) => MailAppApiError::Unavailable(message),
    }
}

fn map_backend_persistence_error(error: MailPersistenceError) -> MailBackendApiError {
    match error {
        MailPersistenceError::NotFound(message) => MailBackendApiError::NotFound(message),
        MailPersistenceError::Conflict(message) => MailBackendApiError::Conflict(message),
        MailPersistenceError::Unavailable(message) => MailBackendApiError::Unavailable(message),
    }
}
