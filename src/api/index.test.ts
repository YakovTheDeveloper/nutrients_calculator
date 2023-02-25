import { getToken, setToken } from '@api'
import axios from 'axios'

const mockUser = {
    token: '4ae4612577f2014feb852fb65b7d060633b6ec6f',
    email: 'yaklv2@mail.ru',
}

describe('API', () => {
    test('Request with token, should return user data', async () => {
        setToken(mockUser.token)
        const result = await axios('http://192.168.88.254:8000/me/', {
            method: 'GET',
            headers: {
                Authorization: `Token ${getToken()}`,
            },
        }).then((res) => res.data)

        expect(result).toStrictEqual({
            result: {
                email: mockUser.email,
            },
            detail: '',
        })
    })
})

// test('the fetch fails with an error', async () => {
//     expect.assertions(1)
//     try {
//         await fetchData()
//     } catch (e) {
//         expect(e).toMatch('error')
//     }
// })
