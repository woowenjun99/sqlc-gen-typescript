import { Sql } from "postgres";

export const getAuthorQuery = `-- name: GetAuthor :one
SELECT id, name, bio FROM authors
WHERE id = $1 LIMIT 1`;

export interface GetAuthorArgs {
    id: string;
}

export interface GetAuthorRow {
    id: string;
    name: string;
    bio: string | null;
}

export async function getAuthor(sql: Sql, args: GetAuthorArgs): Promise<GetAuthorRow | null> {
    const rows = await sql.unsafe(getAuthorQuery, [args.id]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    if (!row) {
        return null;
    }
    return {
        id: row[0],
        name: row[1],
        bio: row[2]
    };
}

export const listAuthorsQuery = `-- name: ListAuthors :many
SELECT id, name, bio FROM authors
ORDER BY name`;

export interface ListAuthorsRow {
    id: string;
    name: string;
    bio: string | null;
}

export async function listAuthors(sql: Sql): Promise<ListAuthorsRow[]> {
    return (await sql.unsafe(listAuthorsQuery, []).values()).map(row => ({
        id: row[0],
        name: row[1],
        bio: row[2]
    }));
}

export const createAuthorQuery = `-- name: CreateAuthor :one
INSERT INTO authors (
  name, bio
) VALUES (
  $1, $2
)
RETURNING id, name, bio`;

export interface CreateAuthorArgs {
    name: string;
    bio: string | null;
}

export interface CreateAuthorRow {
    id: string;
    name: string;
    bio: string | null;
}

export async function createAuthor(sql: Sql, args: CreateAuthorArgs): Promise<CreateAuthorRow | null> {
    const rows = await sql.unsafe(createAuthorQuery, [args.name, args.bio]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    if (!row) {
        return null;
    }
    return {
        id: row[0],
        name: row[1],
        bio: row[2]
    };
}

export const deleteAuthorQuery = `-- name: DeleteAuthor :exec
DELETE FROM authors
WHERE id = $1`;

export interface DeleteAuthorArgs {
    id: string;
}

export async function deleteAuthor(sql: Sql, args: DeleteAuthorArgs): Promise<void> {
    await sql.unsafe(deleteAuthorQuery, [args.id]);
}

