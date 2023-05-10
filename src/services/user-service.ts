import { badRequest, HttpError, serverError } from '@help/errors'
import crypto from 'crypto'
import { passwordSecretKey, tokenSecretKey } from 'env'
import mysql from 'mysql2'
import { db } from "./db-service"
import { mapperService } from './mapper-service'

const hash = (s: string) => {
    return crypto.createHash('sha256').update(s).digest('hex')
}

export type TokenPayload = {
    id: number,
    login: string,
    expires: number
}

export type UserCreationData = {
    login: string,
    name: string,
    surname: string,
    patronymic: string,
    bdate: string,
    city: string | null,
    university: string | null,
    avatar: string | null,
    password: string
}

export const userService = {
    reg: async (data: UserCreationData) => {
        try {
            const id = await db.insert('users', {
                ...data,
                password: hash(data.password + passwordSecretKey)
            })
            return id
        }
        catch (e) {
            if (e instanceof HttpError && e.parentError !== undefined) {
                const pe = e.parentError as mysql.QueryError
                if (pe.code === 'ER_DUP_ENTRY') {
                    throw serverError('Пользователь с таким логином уже существует')
                }
            }
            throw e
        }
    },

    getToken: async (login: string, password: string) => {
        const user = await db.selectOne(
            `select id
               from users
              where login = :login
                and password = :password`,
            {
                login,
                password: hash(password + passwordSecretKey)
            }
        )
        if (!user) {
            throw badRequest('Пользователя с такими данными не существует')
        }
        const expires = new Date()
        expires.setDate(expires.getDate() + 14)
        const tokenPayload: TokenPayload = {
            id: user.id as number,
            login,
            expires: +expires
        }
        const tokenPayloadString = Buffer.from(JSON.stringify(tokenPayload)).toString('base64')
        const sign = hash(tokenPayloadString + tokenSecretKey)
        return `${tokenPayloadString}.${sign}`
    },

    getTokenData: (token: string | undefined) => {
        if (!token) return null
        const [payloadString, sign] = token.split('.')
        const payload: TokenPayload = JSON.parse(Buffer.from(payloadString, 'base64').toString())
        if (payload.expires < +new Date()) {
            throw badRequest('Токен истёк')
        }
        const computedSign = hash(payloadString + tokenSecretKey)
        if (sign !== computedSign) {
            throw badRequest('Подпись токена неверна')
        }
        return payload
    },

    subscribe: async (idUserFrom: number, idUserTo: number) => {
        if (idUserFrom === idUserTo) {
            throw badRequest('Нельзя добавить себя в друзья')
        }
        await db.insert('subscriptions', {
            id_user1: idUserFrom,
            id_user2: idUserTo
        }, { mode: 'ignore' })
    },

    unsubscribe: async (idUserFrom: number, idUserTo: number) => {
        await db.query(
            `delete from subscriptions
              where id_user1 = :u1
                and id_user2 = :u2`, {
            u1: idUserFrom,
            u2: idUserTo
        })
    },

    getUserSubscriptions: async (idUser: number) => {
        return await db.selectAll(
            `select u.id
                   ,u.name
                   ,u.surname
                   ,u.patronymic
                   ,df(u.bdate) as bdate
                   ,u.city
                   ,u.university
                   ,u.avatar
                   ,1 as isSubscription
               from users u
               join subscriptions s on u.id = s.id_user2
              where s.id_user1 = :id`,
            { id: idUser }
        )
    },

    getShortInfo: async (idUser: number) => {
        return await db.selectOne(
            `select id
                   ,name
                   ,surname
                   ,patronymic
                   ,df(bdate) as bdate
                   ,city
                   ,university
                   ,avatar
               from users
              where id = :id`,
            { id: idUser }
        )
    },

    findByName: async (idUser: number, name: string) => {
        return await db.selectAll(
            `with subs as (
                select id_user2 as id
                  from subscriptions
                 where id_user1 = :idUser
             )
             select u.id
                   ,u.name
                   ,u.surname
                   ,u.patronymic
                   ,df(u.bdate) as bdate
                   ,u.city
                   ,u.university
                   ,u.avatar
                   ,s.id is not null as isSubscription
               from users u
               left join subs s on u.id = s.id
              where name like :name`,
            { idUser, name: `%${name}%` }
        )
    },

    isSubscribed: async (idUser1: number, idUser2: number) => {
        const row = await db.selectOne(
            `select 1
               from subscriptions
              where id_user1 = :idUser1
                and id_user2 = :idUser2`,
            { idUser1, idUser2 }
        )
        return row !== null
    },

    getUsersByIds: async (ids: number[]) => {
        if (ids.length === 0) return []
        const strList = ids.join(',')
        const users = await db.selectAll(
            `select id
                   ,name
                   ,surname
                   ,patronymic
                   ,df(bdate) as bdate
                   ,city
                   ,university
                   ,avatar
               from users
              where id in (${strList})`
        )
        return mapperService.mapBy(users, 'id')
    },

    changeAvatar: async (idUser: number, url: string | null) => {
        await db.updateRow('users', {
            id: idUser,
            avatar: url
        })
    }
}
