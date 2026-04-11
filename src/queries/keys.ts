import { getCurrentUser } from "#/dal/userService";

export const jokesQueryKey = ["jokes"] as const;

export const createJokeMutationKey = ["create-joke"] as const;
export const voteJokeMutationKey = ["vote-joke"] as const;
export const deleteJokeMutationKey = ["delete-joke"] as const;
export const getCurrentUserQuery = {
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
};
