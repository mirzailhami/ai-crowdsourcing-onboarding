from sqlalchemy import Column, Integer, String
from app.models.base import Base

class HelpRequest(Base):
    __tablename__ = "help_requests"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    support_type = Column(String, nullable=False)
    urgency = Column(String, nullable=False)
    email = Column(String, nullable=False)