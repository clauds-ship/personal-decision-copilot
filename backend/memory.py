from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///memory.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

class UserPreference(Base):
    __tablename__ = "preferences"

    id = Column(Integer, primary_key=True)
    category = Column(String)
    value = Column(String)

Base.metadata.create_all(bind=engine)