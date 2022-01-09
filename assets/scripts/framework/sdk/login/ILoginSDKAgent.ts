export type LoginComplete = (isSuccess: boolean, info: string) => void;

export default interface ILoginSDKAgent {
    login(complete: LoginComplete): void;
    getUserInfo(complete: LoginComplete): void;
}
