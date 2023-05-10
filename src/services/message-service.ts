import { db } from "./db-service"

export type Message = {
    id: number,
    text: string,
    created: string,
    updated: string,
    id_user_from: number
    id_user_to: number
}

export type CreatingMessage = Omit<Message, 'id' | 'created' | 'updated'>

export const messageService = {
    createMessage: async (message: CreatingMessage) => {
        return await db.insert('messages', message)
    },
    getMessageById: async (id: number) => {
        return await db.selectOne(
            `select id
                   ,m.text
                   ,dtf(m.created) as created
                   ,dtf(m.updated) as updated
                   ,m.id_user_from
                   ,m.id_user_to
               from messages m
              where id = :id`,
            { id }
        )
    },
    getChatingHistory: async (idUser1: number, idUser2: number) => {
        return await db.selectAll(
            `select id
                   ,text
                   ,dtf(created) as created
                   ,dtf(updated) as updated
                   ,id_user_from = :id1 as ownMessage
               from messages
              where (id_user_from = :id1 and id_user_to = :id2)
                 or (id_user_from = :id2 and id_user_to = :id1)
              order by id`,
            { id1: idUser1, id2: idUser2 }
        )
    },
    getChatsByUser: async (idUser: number) => {
        return await db.selectAll(
            `with t as (
                select case
                         when id_user_from = :id then
                           id_user_to
                         else
                           id_user_from
                       end as partner_id
                      ,max(id) as last_message_id
                  from messages
                 where id_user_from = :id
                    or id_user_to = :id
                 group by partner_id
            )
            select t.partner_id
                  ,t.last_message_id
                  ,m.text
                  ,dtf(m.created) as created
                  ,dtf(m.updated) as updated
                  ,m.id_user_from = :id as ownMessage
              from t
              join messages m on t.last_message_id = m.id
             order by m.id desc`,
            { id: idUser }
        )
    }
}
