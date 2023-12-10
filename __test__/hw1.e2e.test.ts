import request from 'supertest';
import {app} from '../src/settings'
import {StatusCode} from "../src/settings";

describe('/Videos API Tests', () => {
    const AvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

    type VideoDbType = {
        id: number,
        title: string,
        author: string,
        canBeDownloaded: boolean,
        minAgeRestriction: number | null
        createdAt: string,
        publicationDate: string,
        availableResolutions: typeof AvailableResolutions;
    }
    let videos: VideoDbType[] = [
        {
            id: 1,
            title: "test title",
            author: "string",
            canBeDownloaded: true,
            minAgeRestriction: 15,
            createdAt: "2023-12-04T21:42:23.091Z",
            publicationDate: "2023-12-04T21:42:23.091Z",
            availableResolutions: ["P144"]
        }
    ];

    let video: VideoDbType[] = [
        {
            id: 1,
            title: "test string",
            author: "test author",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2023-12-04T21:42:23.091Z",
            publicationDate: "2023-12-04T21:42:23.091Z",
            availableResolutions: [
                "P144"
            ]
        }
    ];
    it('+ GET all videos', async () => {

        const response = await request(app).get('/videos');

            expect(response.status).toBe(StatusCode.OK_200)
            expect(response.body).toEqual(video)


    });

    it('+ GET video with incorrect id', async () => {
        const nonExistentVideoId = 999;
        const response = await request(app).delete(`/videos/${nonExistentVideoId}`);
        expect(response.status).toBe(StatusCode.NotFound_404);
    });


    it('+ GET video with correct id', async () => {

        const videoId = 1;

        await request(app).get(`/videos/${videoId}`)
            .expect(StatusCode.OK_200, video);


    });


    it('+PUT with correct ID', async () => {
        const videoId = 1;
        const putVideo = {
            title: "Updated Title",
            author: "Updated Author",
            availableResolutions: ["P144"],
        };


        const response = await request(app).put(`/videos/${videoId}`).send(putVideo);

        expect(response.body.title).toBe("Updated Title");
        expect(response.body.author).toBe("Updated Author");
        expect(response.body.availableResolutions).toBe(["P144"]);
    });


    it('+PUT with the empty body', async () => {
        const videoId = 1;
        const putVideo = {};

        const response = await request(app).put(`/videos/${videoId}`).send(putVideo);
        expect(response.status).toBe(204);
    });

    it('should return 404 when updating a non-existent video', async () => {
        const nonExistentVideoId = 999;
        const updatedVideo = {
            title: 'Updated Video Title',
            author: 'Updated Author',
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: '2023-12-05T00:00:00.000Z',
            availableResolutions: ['P720', 'P1080'],
        };

        const response = await request(app).put(`/videos/${nonExistentVideoId}`).send(updatedVideo);
        expect(response.status).toBe(404);
    });

    it('+ POST with the a new video', async () => {
        const newVideo = {
            title: 'New Video',
            author: 'John Doe',
            availableResolutions: ['P144'],
        };

        const response = await request(app).post('/videos').send(newVideo);
        expect(response.status).toBe(StatusCode.Created_201);
        expect(response.body.title).toBe("New Video");
        expect(response.body.author).toBe("John Doe");
        expect(response.body.availableResolutions).toEqual(["P144"]);


    });


    it('- POST with the a new video with wrong title', async () => {
        const newVideo = {
            title: null,
            author: 'John Doe',
            availableResolutions: ['P144'],
        };

        const response = await request(app).post('/videos').send(newVideo);
        expect(response.status).toBe(400);


    });
    it('- POST with the a new video with wrong author', async () => {
        const newVideo = {
            title: "test title",
            author: null,
            availableResolutions: ['P144'],
        };

        const response = await request(app).post('/videos').send(newVideo);
        expect(response.status).toBe(400);


    });

    it('- POST with the a new video with wrong availableResolutions', async () => {
        const newVideo = {
            title: "test title",
            author: null,
            availableResolutions: ['D144'],
        };

        const response = await request(app).post('/videos').send(newVideo);
        expect(response.status).toBe(400);


    });


    it('should return 400 for invalid video creation data', async () => {
        const invalidVideo = {
            title: 'test title',
            author: 'John Doe',
            availableResolutions: ['P144'],
        };

        const response = await request(app).post('/videos').send(invalidVideo);
        expect(response.status).toBe(201);
    });
});

describe('Other Tests', () => {


    it('should delete all videos', async () => {
        const response = await request(app).delete('/testing/all-data');
        expect(response.status).toBe(204);
    });

});
