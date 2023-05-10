import { db } from "./db-service"
import { mapperService } from "./mapper-service"
import { userService } from "./user-service"

export type Post = {
    id: number,
    text: string,
    created: string,
    updated: string,
    id_user: number,
    photo: string | null
}

export type CreatingPost = Omit<Post, 'id' | 'created' | 'updated'>

export const postService = {
    createPost: async (post: CreatingPost) => {
        return await db.insert('posts', post)
    },
    getPostById: async (id: number) => {
        return await db.selectOne(
            `select id
                   ,text
                   ,dtf(created) as created
                   ,dtf(updated) as updated
                   ,photo
               from posts
              where id = :id`,
            { id }
        )
    },
    getPostsByUser: async (idUser: number) => {
        return await db.selectAll(
            `select p.id
                   ,p.text
                   ,dtf(p.created) as created
                   ,dtf(p.updated) as updated
                   ,p.photo
                   ,count(pl.id_user) as likes
                   ,sum(pl.id_user = :id) as hasLike
               from posts p
               left join post_likes pl on p.id = pl.id_post
              where p.id_user = :id
              group by 1, 2, 3, 4, 5
              order by p.id desc`,
            { id: idUser }
        )
    },
    getPostsForUser: async (idUser: number, idFrom: number = 0, limit: number = 5) => {
        const subscriptionsByIdUser = mapperService.mapBy(
            await userService.getUserSubscriptions(idUser),
            'id'
        )
        const posts = await db.selectAll(
            `select p.id
                   ,p.text
                   ,dtf(p.created) as created
                   ,dtf(p.updated) as updated
                   ,p.photo
                   ,p.id_user
                   ,count(pl.id_user) as likes
                   ,sum(pl.id_user = :id) as hasLike
               from posts p
               join subscriptions s on p.id_user = s.id_user2
               left join post_likes pl on pl.id_post = p.id
              where s.id_user1 = :id
                and (!:idFrom or p.id < :idFrom)
              group by 1, 2, 3, 4, 5, 6
              order by p.id desc
              limit ${limit}`,
            { id: idUser, idFrom }
        )
        for (const item of posts) {
            item.user = subscriptionsByIdUser[item.id_user as string]
            delete item.id_user
        }
        return posts
    },
    addLike: async (idUser: number, idPost: number) => {
        await db.insert('post_likes', {
            id_user: idUser,
            id_post: idPost
        }, { mode: 'ignore' })
    },
    removeLike: async (idUser: number, idPost: number) => {
        await db.query(
            `delete from post_likes
             where id_user = :idUser
               and id_post = :idPost`,
            { idUser, idPost }
        )
    },
    deletePost: async (idUser: number, idPost: number) => {
        await db.query(
            `delete from posts
              where id = :idPost
                and id_user = :idUser`,
            { idUser, idPost }
        )
    }
}
