import {Request} from "express";

export const AvailableResolutions = [
    "P144",
    "P240",
    "P360",
    "P480",
    "P720",
    "P1080",
    "P1440",
    "P2160"];
export enum StatusCode {
    OK_200 = 200,
    Created_201 = 201,
    NoContent_204 = 204,
    BadRequest_400 = 400,
    Unauthorized_401 = 401,
    Forbidden_403 = 403,
    NotFound_404 = 404,
    InternalServerError_500 = 500,
}

export type VideoDbType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null
    createdAt: string,
    publicationDate: string,
    availableResolutions: typeof AvailableResolutions;
}


export type RequestWithBody<B> = Request<{}, {}, B, {}>;

export type CreateVideoType = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions
}

export type ErrorMessageType = {
    field: string,
    message: string
}
export type ErrorType = {
    errorsMessages: ErrorMessageType[]
}