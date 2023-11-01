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

/* 댓글 등록 */
Router.post('/reviews/:reviewId/comments', async(req, res, next) => {

})

/* 댓글 목록 조회 */
Router.get('/reviews/:reviewId/comments', async(req, res, next) => {

})





export default Router;