import express from 'express';
import { prisma } from '../utils/prisma/index.js';

// 1. 댓글 작성 API
//     - 댓글 내용, 작성자명, 비밀번호를 **request**에서 전달받기
//     - 댓글 내용을 비워둔 채 API를 호출하면 “댓글 내용을 입력해주세요” 메시지 반환하기
// 2. 댓글 목록 조회 API
//     - 조회하는 리뷰에 작성된 모든 댓글을 목록 형식으로 조회하기
//     - 작성 날짜 기준으로 내림차순(최신순) 정렬하기
// 3. 댓글 수정 API
//     - 댓글 내용, 비밀번호를 **request**에서 전달받기
//     - 댓글 내용을 비워둔 채 API를 호출하면 “댓글 내용을 입력해주세요” 메시지 반환하기
// 4. 댓글 삭제 API
//     - 비밀번호를 비교하여, 동일할 때만 댓글이 **삭제**되게 하기



/*
model Reviews {
  reviewsId Int @id @default(autoincrement()) @map("reviewsId")
  bookTitle String @map("bookTitle")
  title String @map("title")
  content String @map("content")
  starRating Int @default(10) @map("starRating")
  author String @map("author")
  password Int @map("password")

  createdAt DateTime @default(now()) @map("createdAt")
  updatedAt DateTime @updatedAt @map("updatedAt")

  @@map("Reviews")
}
 */




/*
model Comments {
  CommentsId Int @id@default(autoincrement()) @map("CommentsID")
  reviewsId Int @map("reviewsId")
  content String @map("content")
  author String @map("author")
  password Int @map("password")

  createdAt DateTime @default(now()) @map("createdAt")
  updatedAt DateTime @updatedAt @map("updatedAt")

  @@map("Comments")
} */




/* 댓글 등록 */
Router.post('/reviews/:reviewId/comments', async(req, res, next) => {
    const { reviewId } = req.params;

    const { content, author, password } = req.body;

    const comment = await prisma.comments.create({
        data : {reviewId, content, author, password }
    })

    return res.status(201).join({ data: comment })
})

/* 댓글 목록 조회 */
Router.get('/reviews/:reviewId/comments', async(req, res, next) => {
    const { reviewId } = req.params;

    const comments = await prisma.reviews.findMany({
        where: {reviewsId : +reviewId},
        select: {
            CommentsId : true,
            reviewId : true,
            content : true,
            author : true,
            createdAt: true,
            updatedAt: true,
        }
    })
    return res.status(200).json({ data : comments})
})

/* 댓글 수정 */
Router.put('/reviews/:reviewId/comments/:commentId', async(req, res, next) => {
    const { reviewId, commentId } = req.params;

    const { content, author, password } = req.body;

    const comment = await prisma.comments.findUnique({
        where:{commentsId : +commentId}
    })

    if (!comment) {
        return res.status(404).json({errorMessage: "댓글이 존재하지 않습니다."})
    } else if(comment.password !== password || comment.author !== author){
        return res.status(401).json({errorMessage: "작성자명 또는 비밀번호가 일치하지 않습니다."})
    }

    await prisma.comments.update({
        data: { content },
        where: {
            commentsId : +commentId,
            author,
            password
        }
    })
    
    return res.status(200).json({data: "댓글 수정이 완료되었습니다."})
})

/* 댓글 삭제 */
router.delete('/reviews/:reviewId/comments/:commentId', async(req, res, next) => {
    const { reviewId, commentId } = req.params;

    const { content, author, password } = req.body;

    const comment = await prisma.comments.findUnique({
        where:{commentsId : +commentId}
    })

    if (!comment) {
        return res.status(404).json({errorMessage: "댓글이 존재하지 않습니다."})
    } else if(comment.password !== password || comment.author !== author){
        return res.status(401).json({errorMessage: "작성자명 또는 비밀번호가 일치하지 않습니다."})
    }

    await prisma.comments.delete({
        where: {
            commentsId : +commentId,
            author,
            password
        }
    })
    
    return res.status(200).json({data: "댓글 삭제가 완료되었습니다."})
})



export default Router;