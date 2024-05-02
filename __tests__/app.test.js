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
                
                topics.forEach((topic) => {
                    expect(typeof topic.description).toBe('string');
                    expect(typeof topic.slug).toBe('string');
                })
            })
        })
    })

    describe('ERRORS', () => {
        test('404: GET /api/topics - responds with \'404: Not found\' for route that does not exist', () => {
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

        test('200: GET /api/articles?topic=... - responds with a list of articles specified by a topic query', () => {
            return request(app)
                .get('/api/articles?topic=mitch')
                .expect(200)
                .then(({ body }) => {
                    const articles = body.sortedArticles;

                    expect(articles.length).toBe(12)
                    articles.forEach((article) => {
                        expect(article.topic).toBe('mitch');
                    });
                });
        })
    })

    describe('ERRORS', () => {
        test('400: GET /api/articles/:id - responds with \'400: Bad request\' when passed \':id\' is passed an invalid argument', () => {
            return request(app)
            .get('/api/articles/string')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('400: Bad request');
            })
        })
        
        test('400: GET /api/articles?topic=... - responds with \'400: Bad request\' when passed an invalid query', () => {
            return request(app)
                .get('/api/articles?topic=mitch')
                .expect(200)
                .then(({ body }) => {
                    const articles = body.sortedArticles;

                    expect(articles.length).toBe(12)
                    articles.forEach((article) => {
                        expect(article.topic).toBe('mitch');
                    });
                });
        })

        test('404: GET /api/articles/:id - responds with \'404: Not found\' when passed an id that does not exist', () => {
            return request(app)
            .get('/api/articles/16')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('404: Not found');
            })
        })

        test('404: GET /api/articles/:id - responds with \'404: Not found\' for route that does not exist', () => {
            return request(app)
            .get('/api/string/16')
            .expect(404)
            .then(({body}) => {

                expect(body.message).toBe('404: Not found');
            })
        })

    })
})

describe('/api', () => {
    describe('STATUS 200', () => {
        test('200: GET /api - responds with an object of the API\'s endpoints', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                const { endpoints } = body;
    
                expect(endpoints).toEqual(endpointsData);
            })
        })
    })

    describe('ERRORS', () => {
            test('404: GET /api - responds with \'404: Not found\' for route that does not exist', () => {
                return request(app)
                .get('/ap')
                .expect(404)
                .then(({body}) => {
        
                    expect(body.message).toBe('404: Not found');
                })
            })
    })
})

describe('/api/articles', () => {
    describe('STATUS 200', () => {
        test('200: GET /api/articles - responds with an array of article objects containing the relevant keys', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                const { sortedArticles } = body;

                sortedArticles.forEach((article) =>{
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
                const { sortedArticles } = body;
                
                expect(sortedArticles).toBeSortedBy('created_at', {
                    descending: true,
                })
            })
        })
    })

    describe('ERRORS', () => {
        test('404 returns \'404: Not found\' for route that does not exist', () => {
            return request(app)
            .get('/api/j')
            .expect(404)
            .then(({body}) => {
    
                expect(body.message).toBe('404: Not found');
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
                const { comments } = body;

                comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: 1
                    })
                })
            })
        })

        test('200: GET /api/articles/:id/comments - array returned should be sorted by date in descending order', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;

                expect(comments).toBeSortedBy('created_at', {
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
        
        test('404: GET /api/articles/:id/comments - responds with \'404: Not found\' for route that does not exist', () => {
            return request(app)
            .get('/api/articles/1/j')
            .expect(404)
            .then(({body}) => {
                
                expect(body.message).toBe('404: Not found');
            })
        })

        test('400: GET /api/articles/:id/comments  - responds with \'400: Bad request\' when \':id\' is passed an invalid argument', () => {
            return request(app)
            .get('/api/articles/string/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('400: Bad request');
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

        test('404 returns \'404: Not found\' for route that does not exist', () => {
            return request(app)
            .get('/api/articles/3/j')
            .expect(404)
            .then(({body}) => {
    
                expect(body.message).toBe('404: Not found');
            })
        })
    })
})

describe('/api/articles/:id', () => {
    describe('200: PATCH /api/articles/:id - ', () => {
        test('200: GET /api/articles - responds with an array of article objects containing the relevant keys', () => {
            const addToVotes = {
                inc_votes: 4
            };

            return request(app)
            .patch('/api/articles/1')
            .send(addToVotes)
            .expect(200)
            .then(({ body }) => {
                const { article } = body;

                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: 1,
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: 104,
                    article_img_url: expect.any(String),
                })
            })
        })
    })

    describe('ERRORS', () => {
        test('400: POST /api/articles/:id/comments - attempting to post a comment without the required fields will return an appropriate error', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({})
            .expect(400)
            .then(({ body }) => {                
                expect(body.message).toBe('400: Missing required fields');
            })
        })

        test('400: POST /api/articles/:id/comments - attempting to post an incorrectly formatted comment will return an appropriate error', () => {
            const addToVotes = {
                inc_votes: 'four'
            };
            
            return request(app)
            .patch('/api/articles/1')
            .send(addToVotes)
            .expect(400)
            .then(({ body }) => {                
                expect(body.message).toBe('400: Failing schema validation');
            })
        })

        test('404 returns \'404: Not found\' for route that does not exist', () => {
            return request(app)
            .patch('/api/j/1/')
            .send({})
            .expect(404)
            .then(({body}) => {
    
                expect(body.message).toBe('404: Not found');
            })
        })

        test('404: GET /api/articles/:id - responds with \'404: Not found\' for route that does not exist', () => {
            return request(app)
            .get('/api/articles/9999')
            .expect(404)
            .then(({body}) => {

                expect(body.message).toBe('404: Not found');
            })
        })
    })
})

describe('/api/comments/:id', () => {
    describe('STATUS 204', () => {
        test('204: DELETE /api/comments/:id - deletes the comment with the given id and responds with no content', () => {
            return request(app)
            .delete('/api/comments/1')
            .expect(204)
        })
    })

    describe('ERRORS', () => {
        test('404 returns \'404: Not found\' for route that does not exist', () => {
            return request(app)
            .delete('/api/j/1')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe('404: Not found');
            })
        })

        test('400: GET /api/articles/:id - responds with \'404: Not found\' when passed an id that does not exist', () => {
            return request(app)
            .delete('/api/comments/string')
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe('400: Bad request');
            })
        })
    })
})

describe('/api/users', () => {
    describe('STATUS 200', () => {
        test('200: /api/users - responds with an array of user objects', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body}) => {
                const { users } = body;
                
                users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
        })
    })

    describe('ERRORS', () => {
        test('404: GET /api/topics - responds with \'404: Not found\' for route that does not exist', () => {
            return request(app)
            .get('/api/h')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe('404: Not found');
            })
        })
    })
})