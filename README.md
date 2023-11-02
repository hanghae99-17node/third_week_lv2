# third_week_lv2

# INSOMNIA

# 3030 포트사용

/** REVIEW 등록 **/
POST localhost:3030/api/reviews
JSON
{
	"bookTitle" : "책제목",
	"title" : "글제목1",
	"content" : "필독도서",
	"starRating" : 3,
	"author" : "익명",
	"password" : 1234
}

/** REVIEW 조회 **/
GET // localhost:3030/api/reviews

/** REVIEW 상세 조회 **/
GET // localhost:3030/api/reviews/3

/** REVIEW 수정 **/
PUT // localhost:3030/api/reviews/3
JSON
{
  "bookTitle": "더 좋은 삶을 위한 철학",
  "title": "더 좋은 사람이 되기 위한다면 읽어야한다.",
  "content": "이렇게 도덕적으로 노력한다면 세상은 더 좋아질거야",
	"author" : "지은이",
  "starRating": 1,
  "password": 1234
}

/** REVIEW 삭제 **/
DELETE // localhost:3030/api/reviews/3
JSON
{
	"password" : 1234
}


-----------------------------------
/** COMMENT 등록 **/
POST // localhost:3030/api/reviews/1/comments
JSON
{
  "content": "이책도 엄청 좋던데",
  "author":"뭘아는사람",
  "password":1234
}

/** COMMENT 조회 **/
GET // localhost:3030/api//reviews/2/comments

/** COMMENT 수정 **/
PUT // localhost:3030/api/reviews/2/comments/2
JSON
{
  "content":"수정됨",
  "author":"뭘아는사람",
  "password":1234
}

/** COMMENT 삭제 (soft) **/
DELETE // localhost:3030/api/reviews/2/comments/2
JSON
{
  "author":"뭘아는사람",
  "password":1234
}

/** COMMENT 영구삭제 (hard) **/
DELETE // localhost:3030/api/reviews/2/comments/3/permanentDelete
JSON
{
  "author":"뭘아는사람",
  "password":1234
}

/** COMMENT 조회 (soft delete된 content 전체조회) **/
GET // localhost:3030/api//comments/deleted
