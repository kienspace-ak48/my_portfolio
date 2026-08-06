import api from "./axios";
import type { User } from "../types/user";

export const getUsers = () => api.get<{ data: User[] }>("/users");
