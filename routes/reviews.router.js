import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import joi from 'joi';

const router = express.Router();

const createReviews = joi.object({
  bookTitle: joi.string(),
  title: joi.string().required(),
  content: joi.string().required(),
  starRating: joi.number().min(1).max(10).required(),
  author: joi.string().required(),
  password: joi.number().required()
});

/** 리뷰 등록 **/
//api/reviews POST
router.post('/reviews', async (req, res) => {
  try {
    const validation = await createReviews.validateAsync(req.body);
    const { bookTitle, title, content, starRating, author, password } = validation;

    const reviews = await prisma.reviews.create({
      data: { bookTitle, title, content, starRating, author, password }
    });

    return res.status(201).json({ message: '책 리뷰를 등록하였습니다.' })
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/** 리뷰 목록 조회 **/
//api/reviews GET
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await prisma.reviews.findMany({
      where: { deletedAt: null },
      select: {
        reviewsId: true,
        bookTitle: true,
        title: true,
        author: true,
        starRating: true,
        createdAt: true,
        updatedAt: true,
      }
    })
    return res.status(200).json({ data: reviews })
  } catch (error) {
    return res.status(400).json({ error });
  }
});

/** 리뷰 상세 조회 **/
//api/reviews/:reviewId GET
router.get('/reviews/:reviewsId', async (req, res) => {
  try {
    const { reviewsId } = req.params;

    const reviews = await prisma.reviews.findFirst({
      where: { reviewsId: +reviewsId },
      select: {
        reviewsId: true,
        bookTitle: true,
        title: true,
        content: true,
        author: true,
        starRating: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
      }
    });
    return res.status(200).json({ data: reviews })
  } catch (error) {
    return res.status(400).json({ error });
  };
});

/** 리뷰 정보 수정 **/
//api/reviews/:reviewId PUT
router.put('/reviews/:reviewsId', async (req, res) => {
  try {
    const validation = await createReviews.validateAsync(req.body);

    const { bookTitle, title, content, starRating, author, password } = validation;

    const { reviewsId } = req.params; 

    const reviews = await prisma.reviews.findUnique({
      where: { reviewsId: +reviewsId }
    });

    if (!reviewsId) {
      return res.status(404).json({ message: '데이터 형식이 올바르지 않습니다.' })
    } else if (!reviews) {
      return res.status(404).json({ message: '존재하지 않는 리뷰입니다.' })
    } else if (reviews.password !== password) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' })
    }

    await prisma.reviews.update({
      data: { bookTitle, title, content, starRating, author },
      where: { reviewsId: +reviewsId, password }
    });

    return res.status(201).json({ message: '책 리뷰를 수정하였습니다.' })
  } catch (error) {
    return res.status(400).json({ error });
  };
});

/** 리뷰 삭제 **/
//api/reviews/:reviewId DELETE
router.delete('/reviews/:reviewsId', async (req, res) => {
  try {
    const { password } = req.body;
    const { reviewsId } = req.params;

    const reviews = await prisma.reviews.findFirst({
      where: { reviewsId: +reviewsId }
    });

    if (!reviewsId) {
      return res.status(404).json({ message: '데이터 형식이 올바르지 않습니다.' })
    } else if (!reviews) {
      return res.status(404).json({ message: '존재하지 않는 리뷰입니다.' })
    } else if (reviews.password !== password) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' })
    }

    // await prisma.reviews.delete({ where: { reviewsId : +reviewsId, password }})
    await prisma.reviews.update({
      data: { deletedAt: new Date() },
      where: { reviewsId: +reviewsId }
    });

    return res.status(200).json({ message: "책 리뷰를 삭제하였습니다." });
  } catch (error) {
    return res.status(400).json({ error });
  };
});

export default router;
