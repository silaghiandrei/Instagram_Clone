from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import uvicorn

app = FastAPI()

POST_UPVOTE_POINTS = 2.5
COMMENT_UPVOTE_POINTS = 5.0
POST_DOWNVOTE_POINTS = -1.5
COMMENT_DOWNVOTE_POINTS = -2.5
DOWNVOTE_OTHER_COMMENT_POINTS = -1.5

class Vote(BaseModel):
    voterId: int
    contentId: int
    contentType: str
    voteType: str
    authorId: int

class ScoreRequest(BaseModel):
    vote: Dict[str, Any]

class ScoreResponse(BaseModel):
    score: float

@app.post("/calculate", response_model=ScoreResponse)
async def calculate_score(request: ScoreRequest):
    try:
        vote = request.vote
        content_type = vote["contentType"]
        vote_type = vote["voteType"]

        
        score = 0.0
        
        if vote_type == "UPVOTE":
            if content_type == "POST":
                score = POST_UPVOTE_POINTS
            elif content_type == "COMMENT":
                score = COMMENT_UPVOTE_POINTS
        elif vote_type == "DOWN_VOTE":
            if content_type == "POST":
                score = POST_DOWNVOTE_POINTS
            elif content_type == "COMMENT":
                score = COMMENT_DOWNVOTE_POINTS

        return ScoreResponse(score=score)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001) 