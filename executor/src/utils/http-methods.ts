import Enum from "~/utils/enum.ts";

export const httpMethods = Enum('GET', 'POST', 'PUT', 'PATCH', 'DELETE');

export type HttpMethod = keyof typeof httpMethods;
