import express, {Express, Request, Response} from 'express';
import bodyParser from 'body-parser';

export const app: Express = express();
app.use(express.json())
//app.use(bodyParser.json()); // Add this line to parse JSON requests
const AvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

export enum CodeResponsesEnum {
    Incorrect_values_400 = 400,
    Not_found_404 = 404,
    Not_content_204 = 204

}

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
        availableResolutions: [
            "P144"
        ]
    }
]

type RequestWithParams<P> = Request<P, {}, {}, {}>;


app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})

type RequestWithBody<B> = Request<{}, {}, B, {}>;

type Body = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions
}


type Params = {
    id: string;
}



app.delete('/videos/:id', (req: Request, res: Response) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.send(204)
            return;

        }
    }
    res.send(404)
})


app.get('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const video = videos.find((v) => v.id === id)
    if (!video) {
        res.sendStatus(404)
        return
    }
    res.send(videos)
})

app.put('/videos/:id', (req: Request, res: Response) => {
    let title = req.body.title
    if (!title || !title.trim() || title.length > 40 || typeof (title) !== "string") {
        res.status(400).send({
            "errorMessage": [{
                "message": "Incorrect title",
                "filed": "title"
            }]


        })
        return
    }
    const id = +req.params.id
    let video = videos.find((v) => v.id === id)
    if (video) {
        video.title = req.body.title
        res.send(video)

    } else {
        res.send(404)
    }

})



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
    errorMessage: ErrorMessageType[]
}
app.post('/videos', (req: RequestWithBody<CreateVideoType>, res: Response) => {
    let {title, author, availableResolutions} = req.body



    let errors: ErrorType = {
        errorMessage: []
    }



    if (!title || !title.trim() || title.trim().length > 40) {
        errors.errorMessage.push({message: "Invalid title", field: "title"})
    }

    if (!author || !author.trim().length || author.trim().length > 20) {
        errors.errorMessage.push({message: "Invalid author", field: "author"});
    }

    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach((r) => {
            !AvailableResolutions.includes(r) &&
            errors.errorMessage.push({
                message: "Invalid availableResolutions",
                field: "availableResolutions"
            })
        })


    } else {
        availableResolutions = []
    }

    if (errors.errorMessage.length) {
        res.status(400).send(errors)
        return //!!
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
        createAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions

    }

    videos.push(newVideo);
    res.status(201).send(newVideo);


});


app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = []
    res.sendStatus(204);
})


