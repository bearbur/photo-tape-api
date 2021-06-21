export interface UserArticlesRequest {
    body: { title: string; content: string };
    headers: {
        authorization: string;
    };
}
