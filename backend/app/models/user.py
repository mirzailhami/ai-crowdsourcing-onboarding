from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from . import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    REVIEWER = "reviewer"
    PARTICIPANT = "participant"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.PARTICIPANT)
    submissions = relationship("Submission", back_populates="user")