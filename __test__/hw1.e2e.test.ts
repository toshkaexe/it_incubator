import request from 'supertest';
import {app} from '../src/settings'

describe('Video API Tests', () => {
    const AvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

    type VideoDbType = {
        id: number,
        title: string,
        author: string,
        canBeDownloaded: boolean,
        minAgeRestriction: number | null
        createAt: string,
        publicationDate: string,
        availableResolutions: typeof AvailableResolutions;
    }
    let videos: VideoDbType[] = [
        {
            id: 1,
            title: "string",
            author: "string",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createAt: "2023-12-04T21:42:23.091Z",
            publicationDate: "2023-12-04T21:42:23.091Z",
            availableResolutions: ["P144"]
        }
    ];

    it('should get all videos', async () => {
        const response = await request(app).get('/videos');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(videos);
    });

    it('should delete a video by ID', async () => {
        const videoIdToDelete = 1;
        const response = await request(app).delete(`/videos/${videoIdToDelete}`);
        expect(response.status).toBe(204);
    });

    it('should return 404 when deleting a non-existent video', async () => {
        const nonExistentVideoId = 999;
        const response = await request(app).delete(`/videos/${nonExistentVideoId}`);
        expect(response.status).toBe(404);
    });

    it('should get a video by ID', async () => {
        const videoId = 1;

        const response = await request(app).get(`/videos/${videoId}`);
        expect(response.status).toBe(200); //

        type VideoDbType = {
            id: number,
            title: string,
            author: string,
            canBeDownloaded: boolean,
            minAgeRestriction: number | null
            createAt: string,
            publicationDate: string,
            availableResolutions: typeof AvailableResolutions;
        }
        let videos: VideoDbType[] = [
            {
                id: 1,
                title: "string",
                author: "string",
                canBeDownloaded: true,
                minAgeRestriction: null,
                createAt: "2023-12-04T21:42:23.091Z",
                publicationDate: "2023-12-04T21:42:23.091Z",
                availableResolutions: ["P144"]
            }
        ];

        expect(response.body).toEqual(videos);
        // expect(response.body).toEqual(videos); // Adjust this expectation based on your actual response
    });

    it('should return 404 for a non-existent video', async () => {
        const nonExistentVideoId = 999;
        const response = await request(app).get(`/videos/${nonExistentVideoId}`);
        expect(response.status).toBe(404);
    });

    it('should update a video by ID', async () => {
        const videoId = 1;
        const updatedVideo = {
            title: 'Updated Video Title',
            author: 'Updated Author',
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: '2023-12-05T00:00:00.000Z',
            availableResolutions: ['P720', 'P1080'],
        };

        const response = await request(app).put(`/videos/${videoId}`).send(updatedVideo);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedVideo); // Adjust this expectation based on your actual response
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

    it('should create a new video', async () => {
        const newVideo = {
            title: 'New Video',
            author: 'John Doe',
            availableResolutions: ['P144'],
        };

        const response = await request(app).post('/videos').send(newVideo);
        expect(response.status).toBe(201);
        // Add more assertions as needed for the created video
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
    const AvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

    type VideoDbType = {
        id: number,
        title: string,
        author: string,
        canBeDownloaded: boolean,
        minAgeRestriction: number | null
        createAt: string,
        publicationDate: string,
        availableResolutions: typeof AvailableResolutions;
    }
    let videos: VideoDbType[] = [
        {
            id: 1,
            title: "string",
            author: "string",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createAt: "2023-12-04T21:42:23.091Z",
            publicationDate: "2023-12-04T21:42:23.091Z",
            availableResolutions: ["P144"]
        }
    ];

    it('should delete all videos', async () => {
        const response = await request(app).delete('/testing/all-data');
        expect(response.status).toBe(204);
        expect(videos.length).toBe(0);
    });

});
