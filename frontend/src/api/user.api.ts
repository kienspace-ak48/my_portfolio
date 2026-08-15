import adminApi from "./axios";
import type { User } from "../types/user";

export const getUsers = () => adminApi.get<{ data: User[] }>("/users");
