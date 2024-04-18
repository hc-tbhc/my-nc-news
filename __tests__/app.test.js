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
                expect(body.message).toEqual('Path not found');
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
            const {articles} = body;
            expect(articles.length > 0).toBe(true);

            articles.forEach((article) =>{
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
            const {articles} = body;
            const dates = [];
            expect(articles.length > 0).toBe(true);

            articles.forEach((article) =>{
                dates.push(article.created_at);
            })

            expect(articles).toBeSortedBy('created_at', {
                descending: true,
            })
        })
    })
})