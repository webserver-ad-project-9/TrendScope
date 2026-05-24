export type AuthStatus = "checking" | "authenticated" | "anonymous" | "error";

export type KeywordSyncStatus = "idle" | "loading" | "saving" | "ready" | "error";

export interface CurrentUserViewModel {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: string;
}
