const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index')
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
                expect(body.message).toEqual('Path not found');
            })
        })
    })
})

describe('/api', () => {
    test('200: GET /api - responds with ', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            expect(body).toEqual(endpointsData);
        })
    })
})


