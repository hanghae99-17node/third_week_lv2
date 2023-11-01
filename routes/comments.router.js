import express from "express";
import { prisma } from "../utils/prisma/index.js";
import {createComments as createComments} from "../error.hander/joi.error.definition.js"

const router = express.Router();


/* 댓글 등록 */
router.post("/reviews/:reviewsId/comments", async (req, res, next) => {
  try {
    const { reviewsId } = req.params;

    const validationBody = await createComments.validateAsync(req.body);
    const { content, author, password } = validationBody;

    const comment = await prisma.comments.create({
      data: { reviewsId: +reviewsId, content, author, password },
    });

    return res.status(201).json({ data: comment });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/* 댓글 목록 조회 */
router.get("/reviews/:reviewsId/comments", async (req, res, next) => {
  const { reviewsId } = req.params;

  const comments = await prisma.comments.findMany({
    where: { reviewsId: +reviewsId, deletedAt: null },
    select: {
      commentsId: true,
      reviewsId: true,
      content: true,
      author: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.status(200).json({ data: comments });
});

/* 댓글 수정 */
router.put(
  "/reviews/:reviewsId/comments/:commentId",
  async (req, res, next) => {
    try {
      const { reviewsId, commentId } = req.params;

      const validationBody = await createComments.validateAsync(req.body);
      const { content, author, password } = validationBody;

      const comment = await prisma.comments.findUnique({
        where: { commentsId: +commentId },
      });

      if (!comment) {
        return res
          .status(404)
          .json({ errorMessage: "댓글이 존재하지 않습니다." });
      } else if (comment.password !== password || comment.author !== author) {
        return res
          .status(401)
          .json({
            errorMessage: "작성자명 또는 비밀번호가 일치하지 않습니다.",
          });
      }

      await prisma.comments.update({
        data: { content },
        where: {
          commentsId: +commentId,
          author,
          password,
        },
      });

      return res.status(200).json({ data: "댓글 수정이 완료되었습니다." });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

/* 댓글 삭제 soft delete */
router.delete("/reviews/:reviewsId/comments/:commentId", async (req, res, next) => {
    try {
      const { reviewsId, commentId } = req.params;

      const { content, author, password } = req.body;

      const comment = await prisma.comments.findUnique({
        where: { commentsId: +commentId },
      });

      if (!comment) {
        return res
          .status(404)
          .json({ errorMessage: "댓글이 존재하지 않습니다." });
      } else if (comment.password !== password || comment.author !== author) {
        return res
          .status(401)
          .json({
            errorMessage: "작성자명 또는 비밀번호가 일치하지 않습니다.",
          });
      }

      await prisma.comments.update({
        data: { deletedAt: new Date()},
        where: {
          commentsId: +commentId,
          author,
          password,
        },
      });

      return res.status(200).json({ data: "댓글 삭제가 완료되었습니다." });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);


/* 댓글 영구 삭제 */
router.delete("/reviews/:reviewsId/comments/:commentId/permanentDelete", async (req, res, next) => {
    try {
      const { reviewsId, commentId } = req.params;

      const { content, author, password } = req.body;

      const comment = await prisma.comments.findUnique({
        where: { commentsId: +commentId },
      });

      if (!comment) {
        return res
          .status(404)
          .json({ errorMessage: "댓글이 존재하지 않습니다." });
      } else if (comment.password !== password || comment.author !== author) {
        return res
          .status(401)
          .json({
            errorMessage: "작성자명 또는 비밀번호가 일치하지 않습니다.",
          });
      }

      await prisma.comments.delete({
        where: {
          commentsId: +commentId,
          author,
          password,
        },
      });

      return res.status(200).json({ data: "댓글 삭제가 완료되었습니다." });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

/* 삭제처리(soft delete) 된 댓글 조회 */
router.get("/comments/deleted", async (req, res, next) => {


    const comments = await prisma.comments.findMany({
      where: { deletedAt : { not: null} },
      select: {
        commentsId: true,
        reviewsId: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
      },
    });
    
        return res.status(200).json({ data: comments });

  });

export default router;
