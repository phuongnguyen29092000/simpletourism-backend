const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const {newsService} = require('../services')
const { newsSchema} = require('../validations')

/* create new news */
const createNews = catchAsync(async(req, res) => {
    const image = req.file ? { imageUrl: req.file.path } : {}
    const newsBody = Object.assign(req.body, image)
    const validation = await newsSchema.validate(newsBody)
    if (validation.error) {
        const errorMessage = validation.error.details[0].message
        return res.status(httpStatus.BAD_REQUEST).json({
            message: errorMessage
        })
    }

    const news = await newsService.createNews(newsBody)
    if(news) res.status(httpStatus.CREATED).json({
        message: "OK",
        news: news
    }) 
    else res.status(httpStatus.NOT_FOUND).json({
        message: "Don't create new news"
    })
})

/* get all news */
const getAllNews = catchAsync(async(req, res) => {
    const news = await newsService.getAllNews()
    if (news.length==0) {
        res.status(httpStatus.NOT_FOUND).json({
            message: "Not Found"
        })
    } else res.status(httpStatus.OK).json({
        message: "OK",
        news: news
    })
})

const getNewsPerCompany = catchAsync(async(req, res) => {
    const news = await newsService.getNewsPerCompany(req.params.id)
    if (news.length==0) {
        res.status(httpStatus.NOT_FOUND).json({
            message: "Not Found"
        })
    } else res.status(httpStatus.OK).json({
        message: "OK",
        news: news
    })
})

/* get news detail by params id */
const getNewsById = catchAsync(async(req, res) => {
    const newsSingle = await newsService.getNewsById(req.params.id)

    if (!newsSingle) {
        res.status(httpStatus.NOT_FOUND).json({
            message: "Not Found",
        })
    } else res.status(httpStatus.OK).json({
        message: "OK",
        newsSingle: newsSingle
    })
})

/* update news detail by params id*/
const updateNewsById = catchAsync(async(req, res) => {
    const newsDetail = await newsService.getNewsById(req.params.id)
    const image = req.file ? { imageUrl: req.file.path } : { imageUrl: newsDetail.imageUrl}
    const newsSingle = await newsService.updateNewsById(
        req.params.id,
        Object.assign(req.body,image)
    )
    if(!newsSingle) res.status(httpStatus.NOT_FOUND).json({
        message: "Update failed"
    }) 
    else res.status(httpStatus.OK).json({
        message: "OK",
        newsSingle: newsSingle
    })
})

const updateViewerNews = catchAsync(async(req, res) => {
    const newsSingle = await newsService.updateViewerNews(req.params.id)
    if(!newsSingle) res.status(httpStatus.NOT_FOUND).json({
        message: "Update failed"
    }) 
    else res.status(httpStatus.OK).json({
        message: "OK",
        newsSingle: newsSingle
    })
})

/* delete news by params id */
const deleteNewsById = catchAsync(async(req, res) => {
    const newsData = await newsService.getNewsById(req.params.id)
    if (!newsData) {
        res.status(httpStatus.NOT_FOUND).json({
            message: "Not found news"
        })
    }
    await newsService.deleteNewsById(req.params.id)
    res.status(httpStatus.NO_CONTENT).json({
        message: "Delete suscessfully"
    })
})

module.exports = {
    createNews,
    getAllNews,
    getNewsPerCompany,
    getNewsById,
    updateNewsById,
    deleteNewsById,
    updateViewerNews
}