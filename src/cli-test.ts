import { pool } from "@services/db-service";
import { mapperService } from "@services/mapper-service";
import { messageService } from "@services/message-service";
import { postService } from "@services/post-service";
import { userService } from "@services/user-service";
import { validationService } from "@services/validation-service";

const main = async () => {
    // console.log(await userService.reg({
    //     login: 'test',
    //     bdate: '1999-09-09',
    //     city: 'Moscow',
    //     name: 'Pavel',
    //     surname: 'Durov',
    //     patronymic: '',
    //     password: '123456',
    //     university: 'PTU',
    //     avatar: null
    // }))
    // console.log(await userService.reg({
    //     login: 'test2',
    //     bdate: '1999-10-10',
    //     city: 'Moscow',
    //     name: 'Mark',
    //     surname: 'Zukerberg',
    //     patronymic: '',
    //     password: '123456',
    //     university: 'PTU',
    //     avatar: null
    // }))
    // console.log(await userService.subscribe(1, 2))
    // console.log(await userService.subscribe(2, 1))
    // console.log(await userService.unsubscribe(2, 1))
    // console.log(await userService.unsubscribe(1, 2))
    // console.log(await userService.getShortInfo(1))
    // console.log(await userService.findByName('mar'))

    console.log(await postService.createPost({
        id_user: 1,
        photo: null,
        text: 'Первый нах'
    }))
    // console.log(await postService.createPost({
    //     id_user: 2,
    //     photo: null,
    //     text: 'Второй нах'
    // }))
    // console.log(await postService.getPostsByUser(1))
    // console.log(await postService.addLike(1, 2))
    // console.log(await postService.removeLike(1, 2))
    // console.log(await postService.getPostsForUser(1))
    // const list = await userService.getUserSubscriptions(1)
    // console.log(mapperService.mapBy(list, 'id'))
    // console.log(await messageService.createMessage({
    //     id_user_from: 2,
    //     id_user_to: 1,
    //     text: 'hello'
    // }))
    // console.log(await messageService.createMessage({
    //     id_user_from: 1,
    //     id_user_to: 2,
    //     text: 'hru'
    // }))
    // console.log(await messageService.createMessage({
    //     id_user_from: 2,
    //     id_user_to: 1,
    //     text: 'zbs'
    // }))
    // console.log(await messageService.getChatingHistory(1, 2))
    // console.log(await messageService.getChatsByUser(2))
    // console.log(validationService.validate(
    //     {
    //         name: 'Иван1'
    //     },
    //     {
    //         name: ['+', 'name', 'Имя введено неправильно']
    //     },
    //     (value?: string) => new Error(value)
    // ))
}

main().then(() => pool.end())
