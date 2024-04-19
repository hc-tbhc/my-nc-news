const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const endpointsData = require('../endpoints.json');
const request = require('supertest');

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    return db.end();
})

describe('/api/topics', () => {
    describe('STATUS 200', () => {
        test('200: GET /api/topics - responds with an array of topic objects', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                const { topics } = body;
              
                expect(topics.length).toBe(3);
                
                topics.forEach((topic) => {
                    expect(typeof topic.description).toBe('string');
                    expect(typeof topic.slug).toBe('string');
                })
            })
        })
    })
    describe('ERRORS', () => {
        test('404 returns \'path not found\' for route that does not exist', () => {
            return request(app)
            .get('/api/h')
            .expect(404)
            .then(({body}) => {

                expect(body.message).toBe('404: Not found');
            })
        })
    })
})


describe('/api/articles/:id', () => {
    describe('STATUS 200', () => {
        test('200: GET /api/articles/:id - responds with article whose id matches the given id', () => {
            return request(app)
            .get('/api/articles/4')
            .expect(200)
            .then(({ body }) => {
                const { article } = body;

                expect(typeof article.author).toBe('string');
                expect(typeof article.title).toBe('string');
                expect(typeof article.article_id).toBe('number');
                expect(typeof article.body).toBe('string');
                expect(typeof article.topic).toBe('string');
                expect(typeof article.created_at).toBe('string');
                expect(typeof article. votes).toBe('number');
                expect(typeof article.article_img_url).toBe('string');
    
            })
        })
    })

    describe('ERRORS', () => {
        test('404: GET /api/articles/:id - responds with \'404: Not found\' when passed an id that does not exist', () => {
            return request(app)
            .get('/api/articles/16')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('404: Not found');
            })
        })
    })
})

describe('/api', () => {
    test('200: GET /api - responds with an object of the API\'s endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            expect(body).toEqual(endpointsData);
        })
    })
})

describe('/api/articles', () => {
    test('200: GET /api/articles - responds with an array of article objects containing the relevant keys', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect()

            body.forEach((article) =>{
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String),
                })
            })
        })
    })

    test('200: GET /api/articles - array returned should be sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('created_at', {
                descending: true,
            })
        })
    })
})

describe('/api/articles/:id/comments', () => {
    describe('STATUS 200', () => {
        test('200: GET /api/articles/:id/comments - responds with an array of comment objects containing the relevant keys', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                body.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number)
                    })
                })
            })
        })

        test('200: GET /api/articles/:id/comments - array returned should be sorted by date in descending order', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body).toBeSortedBy('created_at', {
                    descending: true,
                })
            })
        })
    })

    describe('ERRORS', () => {
        test('404: GET /api/articles/:id/comments - responds with \'404: Not found\' when passed an id that does not exist', () => {
            return request(app)
            .get('/api/articles/16/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('404: Not found');
            })
        })
    })
})

describe('/api/articles/:id/comments', () => {
    describe('STATUS 201', () => {
        test('201: POST /api/articles/:id/comments - posts comment to chosen article and responds with the posted comment', () => {
            const testComment = {
                username: 'butter_bridge',
                body: 'This is a comment'
            }

            return request(app)
            .post('/api/articles/3/comments')
            .send(testComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;

                const expectedComment = {
                    body: 'This is a comment',
                    votes: 0,
                    author: 'butter_bridge',
                    article_id: 3,
                }
                
                expect(comment).toMatchObject(expectedComment);
            })
        })
    })

    describe('STATUS 400', () => {
        test('400: POST /api/articles/:id/comments - attempting to post a comment without the required fields will return an appropriate error', () => {
            return request(app)
            .post('/api/articles/3/comments')
            .send()
            .expect(400)
            .then(({ body }) => {                
                expect(body.message).toBe('400: Missing required fields');
            })
        })

        test('400: POST /api/articles/:id/comments - attempting to post an incorrectly formatted comment will return an appropriate error', () => {
            const testComment = {
                username: 3,
                body: 'This is a comment'
            }
            
            return request(app)
            .post('/api/articles/3/comments')
            .send(testComment)
            .expect(400)
            .then(({ body }) => {                
                expect(body.message).toBe('400: Failing schema validation');
            })
        })
    })
})

