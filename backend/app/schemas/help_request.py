from pydantic import BaseModel

class HelpRequestBase(BaseModel):
    message: str
    support_type: str
    urgency: str
    email: str

class HelpRequestCreate(HelpRequestBase):
    pass

class HelpRequest(HelpRequestBase):
    id: int

    class Config:
        orm_mode = True