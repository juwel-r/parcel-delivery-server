import { Response } from "express";

interface IToken {
  accessToken: string;
  refreshToken?: string;
}

export const setTokenToCookie = (res: Response, token: IToken) => {
  if (token.accessToken) {
    res.cookie("accessToken", token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite:"none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
  }

  if (token.refreshToken) {
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite:"none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
};
