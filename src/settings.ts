import express, {Express, Request, Response} from 'express';
import {AvailableResolutions, StatusCode, VideoDbType} from "./types";

export const app: Express = express();
app.use(express.json())


let videos: VideoDbType[] = [
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
]

type RequestWithBody<B> = Request<{}, {}, B, {}>;

type CreateVideoType = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions
}

type ErrorMessageType = {
    field: string,
    message: string
}
type ErrorType = {
    errorsMessages: ErrorMessageType[]
}

app.get('/videos', (req: Request, res: Response) => {
    res.status(StatusCode.OK_200).send(videos)
})

app.get('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const video = videos.find((v) => v.id === id)

    if (!video) {
        res.sendStatus(StatusCode.NotFound_404)
        return
    } else {

        res.status(StatusCode.OK_200).send(video)
    }
})

app.delete('/videos/:id', (req: Request, res: Response) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.sendStatus(StatusCode.NoContent_204)
            return;
        }
    }
    res.sendStatus(StatusCode.NotFound_404)
})

app.put('/videos/:id', (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        // req.body is an empty object
        res.sendStatus(StatusCode.BadRequest_400)
        //res.send("")
        return
    }
    let errors: ErrorType = {
        errorsMessages: []
    }

    let title = req.body.title;
    let author = req.body.author;
    let canBeDownloaded = req.body.canBeDownloaded
    let minAgeRestriction = req.body.minAgeRestriction

    let publicationDate = req.body.publicationDate
    let availableResolutions = req.body.availableResolutions


    if (!title || !title.trim() || title.length > 40 || typeof (title) !== "string") {
        errors.errorsMessages.push(
            {
                message: "Incorrect title",
                field: "title"
            })
    }
    if (!author || !author.trim() || author.length > 20 || typeof (author) !== "string") {
        errors.errorsMessages.push(
            {
                message: "Incorrect author",
                field: "author"
            })
    }
    if (!canBeDownloaded || typeof (canBeDownloaded) !== "boolean") {
        errors.errorsMessages.push(
            {
                message: "Incorrect canBeDownloaded",
                field: "canBeDownloaded"
            })

    }

    if ( minAgeRestriction !== null && ( typeof minAgeRestriction !== "number" || minAgeRestriction > 18 || minAgeRestriction < 1 )) {
        errors.errorsMessages.push(
            {
                message: "Incorrect minAgeRestriction",
                field: "minAgeRestriction"

            })
    }


    function isDateTimeString(value: string): boolean {
        const iso8601Regex = /^20\d{2}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}Z$/;
        return iso8601Regex.test(value);
    }

    if (!publicationDate || (isDateTimeString(publicationDate)) == false || typeof (publicationDate) == "number") {
        errors.errorsMessages.push(
            {
                message: "Incorrect publicationDate",
                field: "publicationDate"
            })
    }

    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach((r) => {
            !AvailableResolutions.includes(r) &&
            errors.errorsMessages.push(
                {
                    message: "Incorrect availableResolutions",
                    field: "availableResolutions"

                })
        })
    } else {
        availableResolutions = []
    }
    if (errors.errorsMessages.length) {
        res.status(StatusCode.BadRequest_400).send(errors)
        return //
    }
    const id = +req.params.id
    let video = videos.find((v) => v.id === id)
    if (video) {
        video.title = req.body.title
        video.author = req.body.author
        video.canBeDownloaded = req.body.canBeDownloaded
        video.publicationDate = req.body.publicationDate
        video.availableResolutions = req.body.availableResolutions
        res.status(StatusCode.NoContent_204).send(video)

    } else {
        res.sendStatus(StatusCode.NotFound_404)
    }

})

app.post('/videos', (req: RequestWithBody<CreateVideoType>, res: Response) => {
    let {title, author, availableResolutions} = req.body
    let errors: ErrorType = {
        errorsMessages: []
    }
    if (!title || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({
            message: "Invalid title",
            field: "title"
        })
    }

    if (!author || !author.trim().length || author.trim().length > 20) {
        errors.errorsMessages.push({message: "Invalid author", field: "author"});
    }
    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach((r) => {
            !AvailableResolutions.includes(r) &&
            errors.errorsMessages.push({
                message: "Invalid availableResolutions",
                field: "availableResolutions"
            })
        })
    } else {
        availableResolutions = []
    }
    if (errors.errorsMessages.length) {
        res.status(StatusCode.BadRequest_400).send(errors)
        return //
    }

    const createdAt = new Date();
    const publicationDate = new Date();

    publicationDate.setDate(createdAt.getDate() + 1);

    const newVideo = {
        id: +(new Date()),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions
    }
    videos.push(newVideo);

    res.status(StatusCode.Created_201).send(newVideo);
});


app.delete('/testing/all-data', (req: Request, res: Response) => {
    try {
        videos = [];
        res.sendStatus(StatusCode.NoContent_204);
    } catch (error) {
        console.error('Error resetting videos:', error);
        res.status(StatusCode.InternalServerError_500).send({error: 'Internal Server Error'});
    }
});
