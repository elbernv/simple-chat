export type SessionInfoType = {
  id?: number;
  type?: number;
  iat: number;
  exp: number;
  jti: string;
  atjwtid?: string;
};
